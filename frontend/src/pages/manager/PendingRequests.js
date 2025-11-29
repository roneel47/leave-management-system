import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagerLayout from '../../components/layouts/ManagerLayout';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/leave-requests`);
      const pending = res.data.filter(req => req.status === 'pending');
      setRequests(pending);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await axios.patch(`${API_URL}/api/leave-requests/${requestId}/status`, {
        status: action
      });
      fetchPendingRequests();
    } catch (err) {
      console.error('Error updating request:', err);
    }
  };

  const getLeaveTypeBadgeColor = (type) => {
    switch(type) {
      case 'sick':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'vacation':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'casual':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredRequests = requests.filter(req =>
    req.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ManagerLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">
              Pending Leave Requests
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
              Review and action all pending leave requests from your team.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary dark:bg-primary/20 font-medium py-2 px-4 rounded-lg">
            <span>{requests.length} Pending Requests</span>
          </div>
        </div>

        {/* Toolbar & SearchBar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-gray-500 dark:text-gray-400 flex bg-background-light dark:bg-background-dark items-center justify-center pl-4 rounded-l-lg">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by employee name..."
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-background-light dark:bg-background-dark h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
          </div>
          <div className="flex gap-2 items-center">
            <button className="h-12 w-12 flex items-center justify-center text-gray-600 dark:text-gray-300 bg-background-light dark:bg-background-dark rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="h-12 w-12 flex items-center justify-center text-gray-600 dark:text-gray-300 bg-background-light dark:bg-background-dark rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <span className="material-symbols-outlined">swap_vert</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No matching requests found.' : 'No pending requests at the moment.'}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/12">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/12">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-3/12">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/12">
                    Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/12">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((req) => (
                  <tr key={req._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary rounded-full size-10 flex items-center justify-center text-white font-bold">
                          {req.userId?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {req.userId?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLeaveTypeBadgeColor(req.leaveType)}`}>
                        {req.leaveType ? req.leaveType.charAt(0).toUpperCase() + req.leaveType.slice(1) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(req.startDate || req.start).toLocaleDateString()} - {new Date(req.endDate || req.end).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {req.totalDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(req._id, 'approved')}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#50E3C2]/80 hover:bg-[#50E3C2] rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(req._id, 'rejected')}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#D0021B]/80 hover:bg-[#D0021B] rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ManagerLayout>
  );
};

export default PendingRequests;
