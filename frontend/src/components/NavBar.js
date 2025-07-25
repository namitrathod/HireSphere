import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/jobs" className="text-xl font-bold text-blue-600">
              JobPortal
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 font-medium">Jobs</Link>
            <Link to="/applications" className="text-gray-700 hover:text-blue-600 font-medium">Applications</Link>
            <Link to="/interviews" className="text-gray-700 hover:text-blue-600 font-medium">Interviews</Link>
            <Link to="/decisions" className="text-gray-700 hover:text-blue-600 font-medium">Decisions</Link>
          </div>

          {/* Logout Button */}
          <div className="hidden md:flex">
            <button
              onClick={handleLogout}
              className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-1 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
