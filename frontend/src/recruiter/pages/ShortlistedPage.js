import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaEye, FaUser, FaBriefcase } from 'react-icons/fa';
import { recruiterAPI } from '../../api';

const ShortlistedPage = () => {
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShortlistedCandidates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recruiterAPI.getShortlistedApplications();
        setShortlistedCandidates(data);
      } catch (err) {
        console.error('Error fetching shortlisted candidates:', err);
        setError('Failed to load shortlisted candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchShortlistedCandidates();
  }, []);

  const handleScheduleInterview = (candidateId) => {
    navigate(`/recruiter/schedule-interview/${candidateId}`);
  };

  const handleViewApplication = (candidateId) => {
    navigate(`/recruiter/view-application/${candidateId}`);
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Candidates</h3>
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
              <h1 className="text-3xl font-bold text-gray-900">Shortlisted Candidates</h1>
              <p className="mt-2 text-gray-600">
                {shortlistedCandidates.length} candidates who passed screening
              </p>
            </div>
            <button
              onClick={() => navigate("/recruiter/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortlistedCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{candidate.candidate_name}</h3>
                    <p className="text-sm text-gray-500">{candidate.candidate_email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <FaBriefcase className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{candidate.job_title}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Department:</span> {candidate.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Experience:</span> {candidate.experience || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Skills:</span> {candidate.skills || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Applied:</span> {candidate.applied_date}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleScheduleInterview(candidate.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaCalendarAlt className="mr-2" />
                  Schedule Interview
                </button>
                <button
                  onClick={() => handleViewApplication(candidate.id)}
                  className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEye />
                </button>
              </div>
            </div>
          ))}
        </div>

        {shortlistedCandidates.length === 0 && (
          <div className="text-center py-12">
            <FaUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shortlisted candidates</h3>
            <p className="mt-1 text-sm text-gray-500">
              Candidates who pass screening will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistedPage;
