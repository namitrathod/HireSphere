import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaBriefcase, 
  FaUsers, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaSignOutAlt,
  FaUser,
  FaChartBar
} from "react-icons/fa";

export default function AdminNavBar() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username") || "Admin";
  
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/admin" className="text-xl font-bold text-white flex items-center">
              <FaUser className="mr-2" />
              Admin Panel
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/admin" 
              className="text-gray-300 hover:text-white font-medium flex items-center transition-colors"
            >
              <FaChartBar className="mr-1" />
              Dashboard
            </Link>
            <Link 
              to="/admin/users" 
              className="text-gray-300 hover:text-white font-medium flex items-center transition-colors"
            >
              <FaUsers className="mr-1" />
              Users
            </Link>
            <Link 
              to="/admin/jobs" 
              className="text-gray-300 hover:text-white font-medium flex items-center transition-colors"
            >
              <FaBriefcase className="mr-1" />
              Jobs
            </Link>
            <Link 
              to="/admin/applications" 
              className="text-gray-300 hover:text-white font-medium flex items-center transition-colors"
            >
              <FaFileAlt className="mr-1" />
              Applications
            </Link>
            <Link 
              to="/admin/interviews" 
              className="text-gray-300 hover:text-white font-medium flex items-center transition-colors"
            >
              <FaCalendarAlt className="mr-1" />
              Interviews
            </Link>
            <Link 
              to="/admin/decisions" 
              className="text-gray-300 hover:text-white font-medium flex items-center transition-colors"
            >
              <FaCheckCircle className="mr-1" />
              Decisions
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-300 text-sm font-medium flex items-center">
              <FaUser className="mr-1" />
              Welcome, {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-400 border border-red-400 hover:bg-red-400 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <FaSignOutAlt className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 