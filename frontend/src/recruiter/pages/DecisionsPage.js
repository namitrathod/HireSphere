import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaUser, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { recruiterAPI } from '../../api';

const DecisionsPage = () => {
  const [decisions, setDecisions] = useState([]);
  const [undecidedApps, setUndecidedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('undecided');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recruiterAPI.getDecisions();
        setDecisions(data.decisions || []);
        setUndecidedApps(data.undecided_applications || []);
      } catch (err) {
        console.error('Error fetching decisions:', err);
        setError('Failed to load decisions');
      } finally {
        setLoading(false);
      }
    };

    fetchDecisions();
  }, []);

  const handleHire = async (appId) => {
    try {
      await recruiterAPI.makeDecision(appId, 'Hired');
      // Refresh the data
      const data = await recruiterAPI.getDecisions();
      setDecisions(data.decisions || []);
      setUndecidedApps(data.undecided_applications || []);
    } catch (err) {
      console.error('Error making hiring decision:', err);
      alert('Failed to make hiring decision');
    }
  };

  const handleReject = async (appId) => {
    try {
      await recruiterAPI.makeDecision(appId, 'Rejected');
      // Refresh the data
      const data = await recruiterAPI.getDecisions();
      setDecisions(data.decisions || []);
      setUndecidedApps(data.undecided_applications || []);
    } catch (err) {
      console.error('Error making rejection decision:', err);
      alert('Failed to make rejection decision');
    }
  };

  const getDecisionColor = (decision) => {
    return decision === 'Hired' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Decisions</h3>
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
              <h1 className="text-3xl font-bold text-gray-900">Hiring Decisions</h1>
              <p className="mt-2 text-gray-600">
                Manage hiring decisions for shortlisted candidates
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

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('undecided')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'undecided'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Undecided ({undecidedApps.length})
              </button>
              <button
                onClick={() => setActiveTab('decisions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'decisions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Decisions ({decisions.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'undecided' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Undecided Applications</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {undecidedApps.map((app) => (
                <div key={app.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{app.candidate_name}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaBriefcase className="mr-1" />
                            {app.job_title}
                          </div>
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            Applied: {app.applied_date}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Department:</span> {app.department}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Skills:</span> {app.skills || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleHire(app.id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <FaCheckCircle className="mr-1" />
                        Hire
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <FaTimesCircle className="mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {undecidedApps.length === 0 && (
              <div className="text-center py-12">
                <FaCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No undecided applications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All shortlisted candidates have been processed.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Completed Decisions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {decisions.map((decision) => (
                <div key={decision.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{decision.candidate_name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDecisionColor(decision.decision)}`}>
                            {decision.decision}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaBriefcase className="mr-1" />
                            {decision.job_title}
                          </div>
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            Decided: {decision.decision_date}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Department:</span> {decision.department}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {decisions.length === 0 && (
              <div className="text-center py-12">
                <FaCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No decisions made yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Hiring decisions will appear here once made.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionsPage;
