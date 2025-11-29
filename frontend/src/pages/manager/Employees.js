import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerLayout from '../../components/layouts/ManagerLayout';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users?role=employee`);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ManagerLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex flex-col gap-2">
            <p className="text-white dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
              All Employees
            </p>
            <p className="text-[#818DA9] dark:text-[#818DA9] text-base font-normal leading-normal">
              View all employees and their leave balances.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1">
            <div className="flex w-full items-center gap-2 rounded-lg border border-[#253049] bg-[#0B1120] px-4 h-10">
              <span className="material-symbols-outlined text-[#818DA9]">search</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-[#E0E6F7] placeholder:text-[#818DA9] focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-[#131B2E] dark:bg-[#131B2E] rounded-xl border border-[#253049] dark:border-[#253049] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#818DA9]">Loading...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-[#818DA9] dark:text-[#818DA9]">
              {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0B1120] dark:bg-[#0B1120]">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Name</th>
                    <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Email</th>
                    <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Vacation</th>
                    <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Sick</th>
                    <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Casual</th>
                    <th className="p-4 text-sm font-semibold text-[#818DA9] dark:text-[#818DA9]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#253049] dark:divide-[#253049]">
                  {filteredEmployees.map((emp) => {
                    const vacation = emp.leaveBalance?.vacation ?? 0;
                    const sick = emp.leaveBalance?.sick ?? 0;
                    const casual = emp.leaveBalance?.casual ?? 0;
                    const total = vacation + sick + casual;

                    return (
                      <tr key={emp._id} className="hover:bg-[#0B1120]/50 dark:hover:bg-[#0B1120]/50">
                        <td className="p-4 text-sm text-[#E0E6F7] dark:text-[#E0E6F7] font-medium">
                          {emp.name}
                        </td>
                        <td className="p-4 text-sm text-[#818DA9] dark:text-[#818DA9]">
                          {emp.email}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-[#253049] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500" 
                                style={{ width: `${(vacation / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-[#E0E6F7] text-xs">{vacation}/5</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-[#253049] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500" 
                                style={{ width: `${(sick / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-[#E0E6F7] text-xs">{sick}/10</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-[#253049] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500" 
                                style={{ width: `${(casual / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-[#E0E6F7] text-xs">{casual}/5</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-[#E0E6F7] dark:text-[#E0E6F7] font-semibold">
                          {total}/20
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ManagerLayout>
  );
};

export default Employees;
