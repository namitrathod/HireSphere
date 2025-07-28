import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUser, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import { recruiterAPI } from '../../api';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recruiterAPI.getInterviews();
        setInterviews(data);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (interviewId) => {
    navigate(`/recruiter/interview/${interviewId}`);
  };

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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Interviews</h3>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scheduled Interviews</h1>
              <p className="mt-2 text-gray-600">
                {interviews.length} interviews scheduled
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/recruiter/shortlisted")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Schedule New Interview
              </button>
              <button
                onClick={() => navigate("/recruiter/dashboard")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Interviews List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Interview Schedule</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {interview.candidate_name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaBriefcase className="mr-1" />
                          {interview.job_title}
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {interview.date}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          {interview.time}
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {interview.location || 'TBD'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: {interview.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(interview.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {interviews.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">
              Schedule interviews from the shortlisted candidates page.
            </p>
            <button
              onClick={() => navigate("/recruiter/shortlisted")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Shortlisted
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewsPage;
