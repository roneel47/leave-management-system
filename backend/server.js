const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./src/models/User');
const LeaveRequest = require('./src/models/LeaveRequest');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leave_management_system';

mongoose.connect(MONGODB_URI)
	.then(() => console.log('MongoDB connected'))
	.catch(err => {
		console.error('MongoDB connection error:', err);
		process.exit(1);
	});


// Home
app.get('/', (req, res) => {
    res.send('Leave Management System API');
});
// Health
app.get('/api/health', (req, res) => {
	res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Auth - Login
app.post('/api/auth/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).lean();
		
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		
		// TODO: Add bcrypt password comparison in production
		if (user.password !== password) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		
		// Return user without password
		const { password: _, ...userWithoutPassword } = user;
		res.json({ user: userWithoutPassword, token: 'mock-jwt-token' });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Auth - Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const user = await User.create({ name, email, password, role });
        res.status(201).json(user);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Users
app.post('/api/users', async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		const user = await User.create({ name, email, password, role });
		res.status(201).json(user);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

// Get all users (optionally filter by role)
app.get('/api/users', async (req, res) => {
	try {
		const { role } = req.query;
		const filter = role ? { role } : {};
		const users = await User.find(filter).select('-password').lean();
		res.json(users);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

app.get('/api/users/:id', async (req, res) => {
	const user = await User.findById(req.params.id).lean();
	if (!user) return res.status(404).json({ error: 'Not found' });
	res.json(user);
});

// Leave Requests For Employees
app.post('/api/leave-requests', async (req, res) => {
	try {
		const lr = await LeaveRequest.create(req.body);
		res.status(201).json(lr);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

// Get all leave requests with user info
app.get('/api/leave-requests', async (req, res) => {
	const items = await LeaveRequest.find().populate('userId', 'name email').lean();
	res.json(items);
});

app.get('/api/leave/my-requests', async (req, res) => {
	const items = await LeaveRequest.find().populate('userId', 'name email').lean();
	res.json(items);
});

// Leave Balances
app.get('/api/leave/balances', async (req, res) => {
    const users = await User.find({}, 'name email leaveBalance').lean();
    res.json(users);
});

// Cancel pending leave request
app.delete('/api/leave-requests/:id', async (req, res) => {
    try {
        const lr = await LeaveRequest.findById(req.params.id);
        if (!lr) {
            return res.status(404).json({ error: 'Leave request not found' });
        }
        if (lr.status !== 'pending') {
            return res.status(400).json({ error: 'Can only cancel pending requests' });
        }
        await LeaveRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leave request cancelled' });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.delete('/api/leave/:id', async (req, res) => {
    try {
        const deleted = await LeaveRequest.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Leave request not found' });
        }
        res.json({ message: 'Leave request deleted' });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Leave Requests For Managers

app.get('/api/leave/all', async (req, res) => {
	const items = await LeaveRequest.find().populate('userId', 'name email').lean();
	res.json(items);
});

app.get('/api/leave/pending', async (req, res) => {
	const items = await LeaveRequest.find({ status: 'pending' }).populate('userId', 'name email').lean();
	res.json(items);
});

// Update leave request status (approve/reject)
app.patch('/api/leave-requests/:id/status', async (req, res) => {
	try {
		const { status, managerComment } = req.body;
		const lr = await LeaveRequest.findById(req.params.id);
		
		if (!lr) {
			return res.status(404).json({ error: 'Leave request not found' });
		}

		if (lr.status !== 'pending') {
			return res.status(400).json({ error: 'Leave request already processed' });
		}

		// If approving, deduct from leave balance
		if (status === 'approved') {
			const user = await User.findById(lr.userId);
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			const days = lr.totalDays || 0;
			const leaveType = lr.leaveType;
			
			// Deduct from appropriate leave type
			if (leaveType === 'sick' && user.leaveBalance.sick) {
				user.leaveBalance.sick = Math.max(0, user.leaveBalance.sick - days);
			} else if (leaveType === 'casual' && user.leaveBalance.casual) {
				user.leaveBalance.casual = Math.max(0, user.leaveBalance.casual - days);
			} else if (leaveType === 'vacation' && user.leaveBalance.vacation) {
				user.leaveBalance.vacation = Math.max(0, user.leaveBalance.vacation - days);
			}
			
			await user.save();
		}

		lr.status = status;
		if (managerComment) {
			lr.managerComment = managerComment;
		}
		await lr.save();

		const populated = await LeaveRequest.findById(lr._id).populate('userId', 'name email').lean();
		res.json({ message: `Leave request ${status}`, leaveRequest: populated });
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

// Legacy approve endpoint
app.put('/api/leave/:id/approve', async (req, res) => {
	try {
		const lr = await LeaveRequest.findById(req.params.id);
		if (!lr) {
			return res.status(404).json({ error: 'Leave request not found' });
		}

		if (lr.status === 'approved') {
			return res.status(400).json({ error: 'Leave request already approved' });
		}

		const user = await User.findById(lr.userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const days = lr.totalDays || 0;
		const leaveType = lr.leaveType;
		
		if (leaveType === 'sick' && user.leaveBalance.sick) {
			user.leaveBalance.sick = Math.max(0, user.leaveBalance.sick - days);
		} else if (leaveType === 'casual' && user.leaveBalance.casual) {
			user.leaveBalance.casual = Math.max(0, user.leaveBalance.casual - days);
		} else if (leaveType === 'vacation' && user.leaveBalance.vacation) {
			user.leaveBalance.vacation = Math.max(0, user.leaveBalance.vacation - days);
		}
		
		await user.save();

		lr.status = 'approved';
		await lr.save();

		const populated = await LeaveRequest.findById(lr._id).populate('userId', 'name email').lean();
		res.json({ message: 'Leave request approved', leaveRequest: populated });
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
