import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const ManagerLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/manager/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/manager/requests', icon: 'pending_actions', label: 'Pending Requests' },
    { path: '/manager/team', icon: 'groups', label: 'Team History' }
  ];

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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  isActive(item.path)
                    ? 'bg-primary/10 dark:bg-primary/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    isActive(item.path)
                      ? 'text-primary'
                      : 'text-[#111318] dark:text-gray-300'
                  }`}
                >
                  {item.icon}
                </span>
                <p
                  className={`text-sm font-medium ${
                    isActive(item.path)
                      ? 'text-primary'
                      : 'text-[#111318] dark:text-gray-300'
                  }`}
                >
                  {item.label}
                </p>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 mt-4">
              <div className="bg-primary bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#111318] dark:text-white text-base font-medium leading-normal truncate">
                  {user?.name}
                </h1>
                <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-[#111318] dark:text-gray-300">logout</span>
              <p className="text-sm font-medium text-[#111318] dark:text-gray-300">Log Out</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

export default ManagerLayout;
