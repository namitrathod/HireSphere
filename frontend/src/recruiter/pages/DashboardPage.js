import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { recruiterAPI } from '../../api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    shortlisted_count: 0,
    interviews_count: 0,
    decisions_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recruiterAPI.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const dashboardCards = [
    {
      title: "Shortlisted Candidates",
      count: stats.shortlisted_count,
      icon: <FaUsers className="text-blue-500" />,
      description: "Candidates who passed screening",
      action: () => navigate("/recruiter/shortlisted"),
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Scheduled Interviews",
      count: stats.interviews_count,
      icon: <FaCalendarAlt className="text-green-500" />,
      description: "Upcoming interview sessions",
      action: () => navigate("/recruiter/interviews"),
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Hiring Decisions",
      count: stats.decisions_count,
      icon: <FaCheckCircle className="text-purple-500" />,
      description: "Completed hiring decisions",
      action: () => navigate("/recruiter/decisions"),
      color: "bg-purple-50 border-purple-200"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your hiring process and candidate pipeline</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border-2 ${card.color} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={card.action}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.count}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className="text-4xl">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/recruiter/shortlisted")}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaUsers className="text-blue-500 mr-3" />
              <span className="font-medium">View Shortlisted</span>
            </button>
            <button
              onClick={() => navigate("/recruiter/interviews")}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaCalendarAlt className="text-green-500 mr-3" />
              <span className="font-medium">Schedule Interviews</span>
            </button>
            <button
              onClick={() => navigate("/recruiter/decisions")}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaCheckCircle className="text-purple-500 mr-3" />
              <span className="font-medium">Make Decisions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
