import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction, setCredentials } from '../../store/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchLeaveRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
      // Refresh user data to get updated leave balance
      const res = await axios.get(`${API_URL}/api/users/${user._id}`);
      dispatch(setCredentials({ user: res.data, token }));
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/leave-requests`);
      // Filter to show only current user's requests
      const userRequests = res.data.filter(req => req.userId?._id === user?._id);
      setLeaveRequests(userRequests.slice(0, 5)); // Show last 5
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/auth');
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return styles[status] || styles.pending;
  };

  const leaveBalance = user?.leaveBalance || { vacation: 0, sick: 0, casual: 0 };
  const totalVacation = 5;
  const totalSick = 10;
  const totalCasual = 5;

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary p-2 rounded-lg">
            <span className="material-symbols-outlined text-white">flight_takeoff</span>
          </div>
          <h1 className="text-xl font-bold text-[#111318] dark:text-white">LeaveTrack</h1>
        </div>

        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-2">
            <Link to="/employee/dashboard" className="flex items-center gap-3 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-2">
              <span className="material-symbols-outlined text-primary">dashboard</span>
              <p className="text-sm font-medium text-primary">Dashboard</p>
            </Link>
            <Link to="/employee/leave-requests" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined text-[#111318] dark:text-gray-300">description</span>
              <p className="text-sm font-medium text-[#111318] dark:text-gray-300">My Requests</p>
            </Link>
            <Link to="/employee/apply-leave" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined text-[#111318] dark:text-gray-300">add_circle</span>
              <p className="text-sm font-medium text-[#111318] dark:text-gray-300">Apply Leave</p>
            </Link>
            <Link to="/employee/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined text-[#111318] dark:text-gray-300">person</span>
              <p className="text-sm font-medium text-[#111318] dark:text-gray-300">Profile</p>
            </Link>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 mt-4">
              <div className="bg-primary bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#111318] dark:text-white text-base font-medium leading-normal truncate">{user?.name}</h1>
                <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined text-[#111318] dark:text-gray-300">logout</span>
              <p className="text-sm font-medium text-[#111318] dark:text-gray-300">Log Out</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <p className="text-[#111318] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Welcome back, {user?.name?.split(' ')[0]}!
              </p>
              <p className="text-[#616f89] dark:text-gray-400 text-base font-normal leading-normal">
                Here's an overview of your leave status and requests.
              </p>
            </div>
            <Link to="/employee/apply-leave">
              <button className="flex min-w-[84px] items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90">
                <span className="material-symbols-outlined">add</span>
                <span>Apply for Leave</span>
              </button>
            </Link>
          </div>

          {/* Leave Balance Cards */}
          <section className="mb-8">
            <h2 className="text-[#111318] dark:text-white text-[22px] font-bold mb-4">Your Leave Balance</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-3 p-6 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex gap-6 justify-between items-center">
                  <p className="text-[#111318] dark:text-white text-base font-medium">Vacation Leave</p>
                  <p className="text-[#616f89] dark:text-gray-400 text-sm">{leaveBalance.vacation ?? 0} / {totalVacation} Days</p>
                </div>
                <div className="rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(((leaveBalance.vacation ?? 0) / totalVacation) * 100)}%` }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-6 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex gap-6 justify-between items-center">
                  <p className="text-[#111318] dark:text-white text-base font-medium">Sick Leave</p>
                  <p className="text-[#616f89] dark:text-gray-400 text-sm">{leaveBalance.sick ?? 0} / {totalSick} Days</p>
                </div>
                <div className="rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: `${(((leaveBalance.sick ?? 0) / totalSick) * 100)}%` }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-6 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex gap-6 justify-between items-center">
                  <p className="text-[#111318] dark:text-white text-base font-medium">Casual Leave</p>
                  <p className="text-[#616f89] dark:text-gray-400 text-sm">{leaveBalance.casual ?? 0} / {totalCasual} Days</p>
                </div>
                <div className="rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: `${(((leaveBalance.casual ?? 0) / totalCasual) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Leave Requests */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#111318] dark:text-white text-[22px] font-bold">Recent Leave Requests</h2>
              <Link to="/employee/leave-requests" className="text-sm font-medium text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : leaveRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No leave requests yet. Click "Apply for Leave" to create one.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date Range</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Type</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Days</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {leaveRequests.map((req) => (
                        <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-4 text-sm text-gray-900 dark:text-gray-200">
                            {new Date(req.startDate || req.start).toLocaleDateString()} - {new Date(req.endDate || req.end).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm text-gray-900 dark:text-gray-200 capitalize">{req.leaveType}</td>
                          <td className="p-4 text-sm text-gray-900 dark:text-gray-200">{req.totalDays}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(req.status)}`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
