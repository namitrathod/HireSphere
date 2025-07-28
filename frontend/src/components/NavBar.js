import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaBriefcase, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";

export default function NavBar() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username") || "User";
  const userRole = sessionStorage.getItem("userRole");
  
  console.log("SessionStorage username:", sessionStorage.getItem("username"));
  console.log("SessionStorage userRole:", sessionStorage.getItem("userRole"));

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/jobs" className="text-xl font-bold text-blue-600 flex items-center">
              <FaBriefcase className="mr-2" />
              Hiresphere
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {userRole === "admin" && (
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors"
              >
                <FaUser className="mr-1" />
                Admin Dashboard
              </Link>
            )}
            <Link 
              to="/jobs" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors"
            >
              <FaBriefcase className="mr-1" />
              Jobs
            </Link>
            <Link 
              to="/applications" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors"
            >
              <FaFileAlt className="mr-1" />
              Applications
            </Link>
            <Link 
              to="/interviews" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors"
            >
              <FaCalendarAlt className="mr-1" />
              Interviews
            </Link>
            <Link 
              to="/decisions" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors"
            >
              <FaCheckCircle className="mr-1" />
              Decisions
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-600 text-sm font-medium flex items-center">
              <FaUser className="mr-1" />
              Welcome, {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center"
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
