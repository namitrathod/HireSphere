import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaUsers, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaSignOutAlt,
  FaBriefcase
} from "react-icons/fa";

export default function RecruiterNavBar() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username") || "Recruiter";
  
  console.log("RecruiterNavBar - SessionStorage username:", sessionStorage.getItem("username"));
  console.log("RecruiterNavBar - SessionStorage userRole:", sessionStorage.getItem("userRole"));

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/recruiter/dashboard" className="text-xl font-bold text-white flex items-center">
              <FaBriefcase className="mr-2" />
              Hiresphere Recruiter
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/recruiter/dashboard" 
              className="text-white hover:text-blue-200 font-medium flex items-center transition-colors"
            >
              <FaHome className="mr-1" />
              Dashboard
            </Link>
            <Link 
              to="/recruiter/shortlisted" 
              className="text-white hover:text-blue-200 font-medium flex items-center transition-colors"
            >
              <FaUsers className="mr-1" />
              Shortlisted
            </Link>
            <Link 
              to="/recruiter/interviews" 
              className="text-white hover:text-blue-200 font-medium flex items-center transition-colors"
            >
              <FaCalendarAlt className="mr-1" />
              Interviews
            </Link>
            <Link 
              to="/recruiter/decisions" 
              className="text-white hover:text-blue-200 font-medium flex items-center transition-colors"
            >
              <FaCheckCircle className="mr-1" />
              Decisions
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-white text-sm font-medium">
              Welcome, {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-white border border-white hover:bg-white hover:text-blue-600 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center"
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