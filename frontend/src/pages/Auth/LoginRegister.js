import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../../store/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/api/auth/login`, { email: formData.email, password: formData.password });
        dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
        navigate(res.data.user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard');
      } else {
        await axios.post(`${API_URL}/api/users`, { name: formData.name, email: formData.email, password: formData.password, role: formData.role });
        const loginRes = await axios.post(`${API_URL}/api/auth/login`, { email: formData.email, password: formData.password });
        dispatch(setCredentials({ user: loginRes.data.user, token: loginRes.data.token }));
        navigate(loginRes.data.user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-10 py-3 bg-surface-dark/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-4 text-white">
          <div className="size-6 text-primary">
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 20.2188C2 20.2188 7.04812 17.2372 12 19.7844C17.5332 22.6314 22 20.1039 22 20.1039V4.50566C22 4.50566 17.534 6.82885 12.0016 3.98406C7.04856 1.43787 2 4.63546 2 4.63546V20.2188Z"></path>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Leave Management</h2>
        </div>
        <div className="flex flex-1 justify-center gap-8">
          <div className="flex items-center gap-2 p-1 bg-background-dark rounded-full border border-border-dark">
            <button
              onClick={() => setIsLogin(true)}
              className={`text-sm font-medium leading-normal px-4 py-1.5 rounded-full transition-colors ${
                isLogin ? 'text-white bg-primary' : 'text-text-muted hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`text-sm font-medium leading-normal px-4 py-1.5 rounded-full transition-colors ${
                !isLogin ? 'text-white bg-primary' : 'text-text-muted hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="layout-container flex h-full grow flex-col p-6 lg:p-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-surface-dark border border-border-dark p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-white text-3xl font-bold mb-6 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-text-muted text-center mb-6">
              {isLogin ? 'Login to access your leave management dashboard.' : 'Register to start managing your leave requests.'}
            </p>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red mb-4">
                <span className="material-symbols-outlined text-xl">error</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <label className="flex flex-col min-w-40 w-full">
                  <span className="text-text-muted text-sm font-medium leading-normal mb-2">Full Name</span>
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light focus:outline-0 focus:ring-2 focus:ring-primary border-border-dark focus:border-primary bg-background-dark h-full placeholder:text-text-muted px-4 text-base font-normal leading-normal"
                      placeholder="Enter your full name"
                    />
                  </div>
                </label>
              )}

              <label className="flex flex-col min-w-40 w-full">
                <span className="text-text-muted text-sm font-medium leading-normal mb-2">Email Address</span>
                <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light focus:outline-0 focus:ring-2 focus:ring-primary border-border-dark focus:border-primary bg-background-dark h-full placeholder:text-text-muted px-4 text-base font-normal leading-normal"
                    placeholder="Enter your email address"
                  />
                </div>
              </label>

              <label className="flex flex-col min-w-40 w-full">
                <span className="text-text-muted text-sm font-medium leading-normal mb-2">Password</span>
                <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light focus:outline-0 focus:ring-2 focus:ring-primary border-border-dark focus:border-primary bg-background-dark h-full placeholder:text-text-muted px-4 text-base font-normal leading-normal"
                    placeholder="Enter your password"
                  />
                </div>
              </label>

              {isLogin && (
                <a className="text-primary text-sm font-medium text-right hover:text-primary-light cursor-pointer">
                  Forgot Password?
                </a>
              )}

              {!isLogin && (
                <label className="flex flex-col min-w-40 w-full">
                  <span className="text-text-muted text-sm font-medium leading-normal mb-2">Register As</span>
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light focus:outline-0 focus:ring-2 focus:ring-primary border-border-dark focus:border-primary bg-background-dark h-full placeholder:text-text-muted px-4 text-base font-normal leading-normal"
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-light transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
              </button>

              {isLogin ? (
                <p className="text-text-muted text-sm text-center mt-4">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-primary hover:text-primary-light"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p className="text-text-muted text-sm text-center mt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:text-primary-light"
                  >
                    Login here
                  </button>
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginRegister;
