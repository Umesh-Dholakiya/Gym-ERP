import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { unreadCount } = useSelector(state => state.notifications);
  const { user } = useSelector(state => state.auth);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/admin/dashboard':
        return 'Dashboard';
      case '/admin/members':
        return 'Members Management';
      case '/admin/trainers':
        return 'Trainers Management';
      case '/admin/inquiries':
        return 'Inquiries';
      case '/admin/services':
        return 'Services';
      case '/admin/analytics':
        return 'Analytics Dashboard';
      case '/admin/notifications':
        return 'Notifications Center';
      case '/admin/settings':
        return 'System Settings';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/admin/dashboard':
        return 'Welcome to your GYM CRM dashboard';
      case '/admin/members':
        return 'Manage gym members and their memberships';
      case '/admin/trainers':
        return 'Manage gym trainers and staff';
      case '/admin/inquiries':
        return 'Track and manage customer inquiries';
      case '/admin/services':
        return 'Manage gym services and offerings';
      case '/admin/analytics':
        return 'Track gym performance and metrics';
      case '/admin/notifications':
        return 'Manage system notifications';
      case '/admin/settings':
        return 'Configure your gym management system';
      default:
        return 'Welcome to your GYM CRM dashboard';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{getPageTitle()}</h1>
          <p className="text-gray-600">{getPageSubtitle()}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;