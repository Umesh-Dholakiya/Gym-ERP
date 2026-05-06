import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-300 mb-6">
          You don't have permission to access this page.
        </p>
        <Link
          to="/admin/login"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;