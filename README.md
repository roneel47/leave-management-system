# Leave Management System

A full-stack leave management application built with **React** (frontend) and **Node.js + Express + MongoDB** (backend).

## Features

- **Role-based Authentication**: Login as Employee or Manager
- **Employee Portal**:
  - View leave balance (Vacation, Sick, Casual)
  - Apply for leave requests
  - Track leave request status
  - View dashboard with recent requests
- **Manager Portal**:
  - Review all leave requests
  - Approve or reject requests
  - View team statistics
  - Manage pending requests

## Tech Stack

### Frontend
- React 19
- React Router DOM (routing)
- Axios (API calls)
- Tailwind CSS (styling)
- Google Material Symbols (icons)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- CORS enabled
- RESTful API

## Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'employee' | 'manager',
  leaveBalance: {
    sickLeave: Number (default: 10),
    casualLeave: Number (default: 5),
    vacation: Number (default: 5)
  }
}
```

### LeaveRequests
```javascript
{
  userId: ObjectId (ref: User),
  leaveType: 'sick' | 'casual' | 'vacation',
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  reason: String,
  status: 'pending' | 'approved' | 'rejected',
  managerComment: String,
  createdAt: Date
}
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```powershell
   git clone https://github.com/roneel47/leave-management-system.git
   cd leave-management-system
   ```

2. **Backend Setup**
   ```powershell
   cd backend
   npm install
   ```
   
   Create `.env` file in `backend/`:
   ```
   PORT=4000
   MONGODB_URI=mongodb://127.0.0.1:27017/leave_management_system
   ```

3. **Frontend Setup**
   ```powershell
   cd leave
   npm install
   ```
   
   Create `.env` file in `leave/`:
   ```
   REACT_APP_API_URL=http://localhost:4000
   ```

### Running the Application

1. **Start MongoDB** (if running locally):
   ```powershell
   mongod
   ```

2. **Start Backend Server**:
   ```powershell
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:4000`

3. **Start Frontend**:
   ```powershell
   cd leave
   npm start
   ```
   Frontend runs on `http://localhost:3000`

## API Endpoints

### Auth
- `POST /api/auth/login` - Login with email and password

### Users
- `POST /api/users` - Create new user (register)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Leave Requests
- `POST /api/leave-requests` - Create leave request
- `GET /api/leave-requests` - Get all leave requests
- `PATCH /api/leave-requests/:id/status` - Update request status (manager only)

## Usage

### Register & Login

1. Navigate to `http://localhost:3000/login`
2. Toggle to "Register" tab
3. Fill in details and select role (Employee/Manager)
4. After registration, you'll be auto-logged in and redirected based on role

### As Employee

- View your leave balance on dashboard
- Click "Apply for Leave" to submit a request
- Track your request status in "My Requests"

### As Manager

- View all pending requests on dashboard
- Approve or reject requests with one click
- Monitor team leave statistics

## Project Structure

```
leave-management-system/
├── backend/
│   ├── src/
│   │   └── models/
│   │       ├── User.js
│   │       └── LeaveRequest.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── leave/ (frontend)
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── employee/
│   │   │   │   ├── Dashboard.js
│   │   │   │   └── ApplyLeave.js
│   │   │   └── manager/
│   │   │       └── Dashboard.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── .env
│   └── package.json
└── README.md
```

## Future Enhancements

- [ ] Password hashing with bcrypt
- [ ] JWT authentication tokens
- [ ] Email notifications
- [ ] Calendar view for team availability
- [ ] Leave history and analytics
- [ ] Admin panel for user management
- [ ] Export reports (PDF/Excel)

## License

This project is for educational purposes.

## Author

[roneel47](https://github.com/roneel47)
