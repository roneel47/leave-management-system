import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginRegister from './pages/Auth/LoginRegister';
import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveRequests from './pages/employee/LeaveRequests';
import Profile from './pages/employee/Profile';
import ManagerDashboard from './pages/manager/Dashboard';
import PendingRequests from './pages/manager/PendingRequests';
import TeamHistory from './pages/manager/TeamHistory';
import './App.css';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<LoginRegister />} />
          
          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute requireRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/apply-leave"
            element={
              <ProtectedRoute requireRole="employee">
                <ApplyLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave-requests"
            element={
              <ProtectedRoute requireRole="employee">
                <LeaveRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute requireRole="employee">
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute requireRole="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/requests"
            element={
              <ProtectedRoute requireRole="manager">
                <PendingRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/team"
            element={
              <ProtectedRoute requireRole="manager">
                <TeamHistory />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

