import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerLayout from '../../components/layouts/ManagerLayout';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const ManagerDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/leave-requests`);
      setLeaveRequests(res.data);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, comment = '') => {
    try {
      await axios.patch(`${API_URL}/api/leave-requests/${id}/status`, {
        status,
        managerComment: comment
      });
      fetchLeaveRequests();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
  const recentRequests = leaveRequests.slice(0, 10);

  return (
    <ManagerLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <p className="text-white dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
              Manager Dashboard
            </p>
            <p className="text-[#818DA9] dark:text-[#818DA9] text-base font-normal leading-normal">
              Review and manage team leave requests.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#131B2E] dark:bg-[#131B2E] rounded-xl border border-[#253049] dark:border-[#253049] p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-900/30 p-3 rounded-lg">
                <span className="material-symbols-outlined text-yellow-400 text-3xl">pending</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white dark:text-white">{pendingRequests.length}</p>
                <p className="text-sm text-[#818DA9] dark:text-[#818DA9]">Pending Requests</p>
              </div>
            </div>
          </div>

          <div className="bg-[#131B2E] dark:bg-[#131B2E] rounded-xl border border-[#253049] dark:border-[#253049] p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-900/30 p-3 rounded-lg">
                <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white dark:text-white">
                  {leaveRequests.filter(r => r.status === 'approved').length}
                </p>
                <p className="text-sm text-[#818DA9] dark:text-[#818DA9]">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-[#131B2E] dark:bg-[#131B2E] rounded-xl border border-[#253049] dark:border-[#253049] p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <span className="material-symbols-outlined text-blue-400 text-3xl">description</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white dark:text-white">{leaveRequests.length}</p>
                <p className="text-sm text-[#818DA9] dark:text-[#818DA9]">Total Requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Requests Table */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white dark:text-white text-xl font-bold">Recent Leave Requests</h2>
          </div>
          <div className="bg-[#131B2E] dark:bg-[#131B2E] rounded-xl border border-[#253049] dark:border-[#253049] overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-[#818DA9]">Loading...</div>
            ) : recentRequests.length === 0 ? (
              <div className="p-8 text-center text-[#818DA9] dark:text-[#818DA9]">
                No leave requests to review.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0B1120] dark:bg-[#0B1120]">
                    <tr>
                      <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Employee</th>
                      <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Type</th>
                      <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Date Range</th>
                      <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Days</th>
                      <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Status</th>
                      <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#253049] dark:divide-[#253049]">
                    {recentRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-[#0B1120]/50 dark:hover:bg-[#0B1120]/50">
                        <td className="p-4 text-sm text-[#E0E6F7] dark:text-[#E0E6F7]">
                          {req.userId?.name || 'Unknown'}
                        </td>
                        <td className="p-4 text-sm text-[#E0E6F7] dark:text-[#E0E6F7] capitalize">{req.leaveType}</td>
                        <td className="p-4 text-sm text-[#E0E6F7] dark:text-[#E0E6F7]">
                          {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm text-[#E0E6F7] dark:text-[#E0E6F7]">{req.totalDays}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize status-badge status-${req.status}`}>
                            <span className="status-dot"></span>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {req.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusUpdate(req._id, 'approved')}
                                className="px-3 py-1 bg-[#34D399] text-white rounded text-xs font-medium hover:bg-[#10B981]"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                className="px-3 py-1 bg-[#F87171] text-white rounded text-xs font-medium hover:bg-[#EF4444]"
                              >
                                Reject
                              </button>
                            </div>
                          )}
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
    </ManagerLayout>
  );
};

export default ManagerDashboard;
