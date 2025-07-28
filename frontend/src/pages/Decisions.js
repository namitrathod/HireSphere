import React, { useEffect, useState } from "react";
import { decisionAPI } from "../api";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaBriefcase, 
  FaBuilding,
  FaCalendarAlt,
  FaSpinner,
  FaTrophy,
  FaHandshake
} from "react-icons/fa";

export default function Decisions() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    decisionAPI.getDecisions()
      .then((data) => {
        setDecisions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load decisions");
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Hired":
        return <FaTrophy className="text-green-500" />;
      case "Rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaHandshake className="text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hired":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your decisions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Decisions</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Hiring Decisions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            View the outcomes of your job applications and track your career progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaBriefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Decisions</p>
                <p className="text-2xl font-bold text-gray-900">{decisions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaTrophy className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hired</p>
                <p className="text-2xl font-bold text-gray-900">
                  {decisions.filter(dec => dec.final_status === "Hired").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <FaTimesCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Not Selected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {decisions.filter(dec => dec.final_status === "Rejected").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decisions List */}
        {decisions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No decisions yet</h3>
            <p className="text-gray-600 mb-6">
              You don't have any hiring decisions yet. Keep applying and interviewing!
            </p>
            <button 
              onClick={() => window.location.href = '/jobs'} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaBriefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {decision.job_title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaBuilding className="mr-2 text-gray-400" />
                        <span>Department</span>
                      </div>
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span>Decision: {new Date(decision.decision_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(decision.final_status)}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(decision.final_status)}`}>
                      {decision.final_status}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Decision #{decision.id}
                    </p>
                  </div>
                </div>

                {decision.final_status === "Hired" && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <FaTrophy className="text-green-600 mr-2" />
                      <span className="text-green-800 font-medium text-sm">
                        Congratulations! You've been hired for this position.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
