const mongoose = require('mongoose');

const LeaveBalanceSchema = new mongoose.Schema({
  sick: { type: Number, default: 10, min: 0 },
  casual: { type: Number, default: 5, min: 0 },
  vacation: { type: Number, default: 5, min: 0 },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  leaveBalance: { 
    type: LeaveBalanceSchema, 
    default: () => ({ sick: 10, casual: 5, vacation: 5 }) 
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
