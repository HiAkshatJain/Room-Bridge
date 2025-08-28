import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, User, MessageCircle, Building, LogOut, Settings, Shield, MapPin } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.roles.includes('ADMIN');

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Room Bridge</span>
          </Link>

          {/* Main links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/rooms" className="text-gray-600 hover:text-blue-600 transition-colors">
              All Rooms
            </Link>

            {user && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/my-rooms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  My Rooms
                </Link>
                <Link to="/location-search" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Search
                </Link>
                <Link to="/chat" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Chat
                </Link>
              </>
            )}
          </div>

          {/* Right side (account / login) */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">Account</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <Link to="/documents" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <Settings className="h-4 w-4 mr-2" />
                    Documents
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
