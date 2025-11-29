import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeLayout from '../../components/layouts/EmployeeLayout';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const LeaveRequests = () => {
  const user = useSelector(selectCurrentUser);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/leave-requests`);
      const mine = res.data.filter(r => r.userId?._id === user?._id);
      setRequests(mine);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/leave-requests/${id}`);
      fetchData(); // Refresh the list
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to cancel request');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return map[status] || map.pending;
  };

  return (
    <EmployeeLayout activeRoute="/employee/leave-requests">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[#111318] dark:text-white text-4xl font-black">My Leave Requests</p>
          <a href="/employee/apply-leave" className="flex items-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90">
            <span className="material-symbols-outlined fill text-xl">add</span>
            <span className="truncate">Request Leave</span>
          </a>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No requests yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Type</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Days</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 text-sm text-gray-900 dark:text-gray-200">
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-gray-900 dark:text-gray-200 capitalize">{req.leaveType}</td>
                      <td className="p-4 text-sm text-gray-900 dark:text-gray-200">{req.totalDays}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(req._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default LeaveRequests;
