import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'employee' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        
        login(res.data.user, res.data.token);
        
        // Navigate based on role
        if (res.data.user.role === 'manager') {
          navigate('/manager/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } else {
        // Register
        await axios.post(`${API_URL}/api/users`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        
        // Auto-login after registration
        const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        
        login(loginRes.data.user, loginRes.data.token);
        
        if (loginRes.data.user.role === 'manager') {
          navigate('/manager/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <div className="flex flex-1 justify-center">
        <div className="flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
          {/* Left Panel - Branding */}
          <div className="flex w-full flex-col items-center justify-center bg-white dark:bg-background-dark lg:w-1/2 p-8 lg:p-12 order-2 lg:order-1">
            <div className="flex w-full max-w-md flex-col items-start gap-6 text-left">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-primary">calendar_clock</span>
                <span className="text-2xl font-bold text-[#111318] dark:text-white">LeaveFlow</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[#111318] dark:text-white leading-tight">
                Streamlining Your Time Off.
              </h1>
              <p className="text-lg text-[#616f89] dark:text-gray-400">
                Manage your leave requests, track approvals, and stay updated on your team's availability, all in one place.
              </p>
              <div className="mt-8 w-full overflow-hidden rounded-xl">
                <img
                  alt="Calendar and time management illustration"
                  className="h-auto w-full object-cover"
                  src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=400&fit=crop"
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex w-full flex-col items-center justify-center bg-background-light dark:bg-black/20 lg:w-1/2 p-8 lg:p-12 order-1 lg:order-2">
            <div className="flex w-full max-w-sm flex-col gap-4">
              {/* Toggle Login/Register */}
              <div className="flex px-0 py-3">
                <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white/50 dark:bg-background-dark p-1 shadow-inner">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex h-full flex-1 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                      isLogin
                        ? 'bg-white dark:bg-gray-700 text-[#111318] dark:text-white shadow-sm'
                        : 'text-[#616f89] dark:text-gray-400'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex h-full flex-1 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                      !isLogin
                        ? 'bg-white dark:bg-gray-700 text-[#111318] dark:text-white shadow-sm'
                        : 'text-[#616f89] dark:text-gray-400'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Header */}
              <div className="flex flex-col px-1 pb-2 pt-2">
                <h1 className="text-[#111318] dark:text-white text-[32px] font-bold leading-tight">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-[#616f89] dark:text-gray-400 text-base">
                  {isLogin ? 'Login to access your leave management dashboard.' : 'Sign up to start managing your leave requests.'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                {!isLogin && (
                  <div className="flex w-full flex-wrap items-end gap-4 px-0 py-2">
                    <label className="flex w-full flex-col min-w-40 flex-1">
                      <p className="text-[#111318] dark:text-gray-300 text-base font-medium pb-2">Full Name</p>
                      <input
                        className="form-input flex w-full rounded-lg border border-[#dbdfe6] bg-white p-[15px] text-base dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required={!isLogin}
                      />
                    </label>
                  </div>
                )}

                <div className="flex w-full flex-wrap items-end gap-4 px-0 py-2">
                  <label className="flex w-full flex-col min-w-40 flex-1">
                    <p className="text-[#111318] dark:text-gray-300 text-base font-medium pb-2">Email Address</p>
                    <input
                      className="form-input flex w-full rounded-lg border border-[#dbdfe6] bg-white p-[15px] text-base dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </label>
                </div>

                <div className="flex w-full flex-wrap items-end gap-4 px-0 py-2">
                  <label className="flex w-full flex-col min-w-40 flex-1">
                    <div className="flex justify-between items-center pb-2">
                      <p className="text-[#111318] dark:text-gray-300 text-base font-medium">Password</p>
                      {isLogin && (
                        <button
                          type="button"
                          className="text-sm font-medium text-primary hover:underline"
                          onClick={() => alert('Forgot password feature coming soon!')}
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="flex w-full items-stretch">
                      <input
                        className="form-input flex w-full rounded-l-lg border border-r-0 border-[#dbdfe6] bg-white p-[15px] text-base dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <div className="flex items-center justify-center rounded-r-lg border border-l-0 border-[#dbdfe6] bg-white pr-[15px] dark:border-gray-600 dark:bg-gray-700">
                        <span
                          className="material-symbols-outlined cursor-pointer text-[#616f89] dark:text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                {!isLogin && (
                  <div className="flex w-full flex-wrap items-end gap-4 px-0 py-2">
                    <label className="flex w-full flex-col min-w-40 flex-1">
                      <p className="text-[#111318] dark:text-gray-300 text-base font-medium pb-2">Register As</p>
                      <select
                        className="form-select flex w-full rounded-lg border border-[#dbdfe6] bg-white p-[15px] text-base dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                      </select>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <div className="w-full px-0 py-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
