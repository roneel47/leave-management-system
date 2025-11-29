import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import EmployeeLayout from '../../components/layouts/EmployeeLayout';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <EmployeeLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
          <div className="flex flex-col gap-1">
            <p className="text-white dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
              My Profile
            </p>
          </div>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#4361EE] text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-[#5E77F3] transform hover:scale-105">
            <span className="material-symbols-outlined text-base">edit</span>
            <span className="truncate">Edit Profile</span>
          </button>
        </div>

        <div className="p-6 rounded-xl border border-[#253049] dark:border-[#253049] bg-[#131B2E] dark:bg-[#131B2E] flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="bg-[#4361EE] bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col text-center md:text-left">
            <p className="text-white dark:text-white text-xl font-bold">{user?.name || 'User'}</p>
            <p className="text-[#818DA9] dark:text-[#818DA9] text-base">{user?.role || 'Employee'}</p>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#253049] dark:border-[#253049] bg-[#131B2E] dark:bg-[#131B2E]">
          <div className="flex border-b border-[#253049] dark:border-[#253049]">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'personal'
                  ? 'text-[#4361EE] border-b-2 border-[#4361EE]'
                  : 'text-[#818DA9] hover:text-white'
              }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'contact'
                  ? 'text-[#4361EE] border-b-2 border-[#4361EE]'
                  : 'text-[#818DA9] hover:text-white'
              }`}
            >
              Contact Information
            </button>
            <button
              onClick={() => setActiveTab('job')}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'job'
                  ? 'text-[#4361EE] border-b-2 border-[#4361EE]'
                  : 'text-[#818DA9] hover:text-white'
              }`}
            >
              Job Information
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'personal' && (
              <>
                <h3 className="text-white dark:text-white text-lg font-bold mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col min-w-40 w-full">
                    <span className="text-[#818DA9] dark:text-[#818DA9] text-sm font-medium leading-normal mb-2">
                      Full Name
                    </span>
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                      <input
                        readOnly
                        type="text"
                        value={user?.name || ''}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#E0E6F7] dark:text-[#E0E6F7] focus:outline-0 focus:ring-2 focus:ring-[#4361EE] border-[#253049] dark:border-[#253049] focus:border-[#4361EE] bg-[#0B1120] dark:bg-[#0B1120] h-full placeholder:text-[#818DA9] px-4 text-base font-normal leading-normal"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col min-w-40 w-full">
                    <span className="text-[#818DA9] dark:text-[#818DA9] text-sm font-medium leading-normal mb-2">
                      Employee ID
                    </span>
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                      <input
                        readOnly
                        type="text"
                        value={user?._id?.slice(-8).toUpperCase() || 'N/A'}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#E0E6F7] dark:text-[#E0E6F7] focus:outline-0 focus:ring-2 focus:ring-[#4361EE] border-[#253049] dark:border-[#253049] focus:border-[#4361EE] bg-[#0B1120] dark:bg-[#0B1120] h-full placeholder:text-[#818DA9] px-4 text-base font-normal leading-normal"
                      />
                    </div>
                  </label>
                </div>
              </>
            )}

            {activeTab === 'contact' && (
              <>
                <h3 className="text-white dark:text-white text-lg font-bold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col min-w-40 w-full">
                    <span className="text-[#818DA9] dark:text-[#818DA9] text-sm font-medium leading-normal mb-2">
                      Email Address
                    </span>
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                      <input
                        readOnly
                        type="email"
                        value={user?.email || ''}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#E0E6F7] dark:text-[#E0E6F7] focus:outline-0 focus:ring-2 focus:ring-[#4361EE] border-[#253049] dark:border-[#253049] focus:border-[#4361EE] bg-[#0B1120] dark:bg-[#0B1120] h-full placeholder:text-[#818DA9] px-4 text-base font-normal leading-normal"
                      />
                    </div>
                  </label>
                </div>
              </>
            )}

            {activeTab === 'job' && (
              <>
                <h3 className="text-white dark:text-white text-lg font-bold mb-4">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col min-w-40 w-full">
                    <span className="text-[#818DA9] dark:text-[#818DA9] text-sm font-medium leading-normal mb-2">
                      Role
                    </span>
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                      <input
                        readOnly
                        type="text"
                        value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#E0E6F7] dark:text-[#E0E6F7] focus:outline-0 focus:ring-2 focus:ring-[#4361EE] border-[#253049] dark:border-[#253049] focus:border-[#4361EE] bg-[#0B1120] dark:bg-[#0B1120] h-full placeholder:text-[#818DA9] px-4 text-base font-normal leading-normal"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col min-w-40 w-full">
                    <span className="text-[#818DA9] dark:text-[#818DA9] text-sm font-medium leading-normal mb-2">
                      Leave Balance
                    </span>
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                      <input
                        readOnly
                        type="text"
                        value={`V: ${user?.leaveBalance?.vacation ?? 0} | S: ${user?.leaveBalance?.sick ?? 0} | C: ${user?.leaveBalance?.casual ?? 0}`}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#E0E6F7] dark:text-[#E0E6F7] focus:outline-0 focus:ring-2 focus:ring-[#4361EE] border-[#253049] dark:border-[#253049] focus:border-[#4361EE] bg-[#0B1120] dark:bg-[#0B1120] h-full placeholder:text-[#818DA9] px-4 text-base font-normal leading-normal"
                      />
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default Profile;
