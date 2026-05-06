import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  BellIcon, 
  CogIcon,
  ArrowLeftOnRectangleIcon,
  UsersIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
    { name: 'Members', icon: UsersIcon, path: '/admin/members' },
    { name: 'Trainers', icon: AcademicCapIcon, path: '/admin/trainers' },
    { name: 'Inquiries', icon: UserGroupIcon, path: '/admin/inquiries' },
    { name: 'Services', icon: CreditCardIcon, path: '/admin/services' },
    { name: 'Analytics', icon: ChartBarIcon, path: '/admin/analytics' },
    { name: 'Notifications', icon: BellIcon, path: '/admin/notifications' },
    { name: 'Settings', icon: CogIcon, path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white w-64 min-h-screen p-4 flex flex-col text-underline-none font-sans">
      <div className="mb-8">
        {/* Logo from header */}
        <Link to="/admin/dashboard" className="d-flex align-items-center mb-3 text-decoration-none">
          <img src="/images/white-logo.svg" alt="Gym Logo" style={{width:'250px', height:'40px'}} />
        </Link>
      
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 px-0">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 text-decoration-none hover-combo ${
                  location.pathname === item.path
                    ? 'bg-orange-500 text-white'
                    : 'text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-white">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 hover-combo"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          <span className="text-white">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;