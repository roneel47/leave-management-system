import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import EmployeeLayout from '../../components/layouts/EmployeeLayout';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const leaveBalance = user?.leaveBalance || { vacation: 0, sick: 0, casual: 0 };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.leaveType || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    const totalDays = calculateDays();
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/leave-requests`, {
        userId: user._id,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays,
        reason: formData.reason,
        status: 'pending'
      });
      
      navigate('/employee/leave-requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/employee/dashboard');
  };

  return (
    <EmployeeLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-1 mb-6">
          <p className="text-white dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
            Apply Leave
          </p>
        </div>
        
        <div className="flex flex-col gap-6 p-6 rounded-xl border border-[#253049] dark:border-[#253049] bg-[#131B2E] dark:bg-[#131B2E]">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-[#0B1120] dark:bg-[#0B1120] text-[#3A86FF]">
            <span className="material-symbols-outlined text-xl">info</span>
            <span className="text-sm font-medium">
              You have {leaveBalance.vacation ?? 0} Vacation days, {leaveBalance.sick ?? 0} Sick days, and {leaveBalance.casual ?? 0} Casual days remaining.
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-900/20 text-red-400">
              <span className="material-symbols-outlined text-xl">error</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col min-w-40 w-full">
                <span className="text-[#818DA9] dark:text-[#818DA9] text-sm font-medium leading-normal mb-2">
                  Leave Type *
                </span>
                <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                    className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#E0E6F7] dark:text-[#E0E6F7] focus:outline-0 focus:ring-2 focus:ring-[#4361EE] border-[#253049] dark:border-[#253049] focus:border-[#4361EE] bg-[#0B1120] dark:bg-[#0B1120] h-full placeholder:text-[#818DA9] px-4 text-base font-normal leading-normal"
                  >
                    <option value="">Select leave type</option>
                    <option value="sick">Sick</option>
                    <option value="casual">Casual</option>
                    <option value="vacation">Vacation</option>
                  </select>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col min-w-40 w-full">
                  <span className="text-[#818DA9] dark:text-[#818DA9] text-sm font-medium leading-normal mb-2">
                    Start Date *
                  </span>
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#E0E6F7] dark:text-[#E0E6F7] focus:outline-0 focus:ring-2 focus:ring-[#4361EE] border-[#253049] dark:border-[#253049] focus:border-[#4361EE] bg-[#0B1120] dark:bg-[#0B1120] h-full placeholder:text-[#818DA9] px-4 text-base font-normal leading-normal"
                    />
                  </div>
                </label>

                <label className="flex flex-col min-w-40 w-full">
                  <span className="text-[#818DA9] dark:text-[#818DA9] text-sm font-medium leading-normal mb-2">
                    End Date *
                  </span>
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      min={formData.startDate}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#E0E6F7] dark:text-[#E0E6F7] focus:outline-0 focus:ring-2 focus:ring-[#4361EE] border-[#253049] dark:border-[#253049] focus:border-[#4361EE] bg-[#0B1120] dark:bg-[#0B1120] h-full placeholder:text-[#818DA9] px-4 text-base font-normal leading-normal"
                    />
                  </div>
                </label>
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="text-[#818DA9] text-sm">
                Total days: <span className="text-white font-medium">{calculateDays()}</span>
              </div>
            )}

            <label className="flex flex-col min-w-40 w-full">
              <span className="text-[#818DA9] dark:text-[#818DA9] text-sm font-medium leading-normal mb-2">
                Reason for Leave (Optional)
              </span>
              <div className="flex w-full flex-1 items-stretch rounded-lg h-24">
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please provide a brief reason for your leave..."
                  className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#E0E6F7] dark:text-[#E0E6F7] focus:outline-0 focus:ring-2 focus:ring-[#4361EE] border-[#253049] dark:border-[#253049] focus:border-[#4361EE] bg-[#0B1120] dark:bg-[#0B1120] h-full placeholder:text-[#818DA9] px-4 py-2 text-base font-normal leading-normal"
                ></textarea>
              </div>
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#253049]/50 text-[#818DA9] text-sm font-medium leading-normal tracking-[0.015em] hover:bg-[#253049] hover:text-[#E0E6F7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#4361EE] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#5E77F3] transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default ApplyLeave;
