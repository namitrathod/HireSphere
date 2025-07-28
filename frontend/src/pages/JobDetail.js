import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobAPI } from "../api";
import { 
  FaBriefcase, 
  FaBuilding, 
  FaCalendarAlt, 
  FaMoneyBillWave,
  FaUserTie,
  FaSpinner,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    setLoading(true);
    jobAPI.getJobDetail(id)
      .then((data) => {
        setJob(data.job);
        setApplied(data.applied);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load job details");
        setLoading(false);
      });
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await jobAPI.applyToJob(id);
      setApplied(true);
      setApplying(false);
    } catch (err) {
      setError("Failed to apply for the job");
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Job</h2>
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

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/jobs')} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Jobs
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaBuilding className="mr-2 text-gray-400" />
                  <span>{job.department.name}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span>Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <FaUserTie className="mr-2 text-gray-400" />
                  <span>Recruiter: {job.recruiter_name}</span>
                </div>
              </div>
            </div>
            <div className="ml-6">
              {applied ? (
                <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-medium">Applied</span>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {applying ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <FaBriefcase className="mr-2" />
                      Apply Now
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Salary */}
          {job.salary && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  Salary: ${job.salary.toLocaleString()}/year
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                {job.description ? (
                  <p className="whitespace-pre-wrap">{job.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No description available.</p>
                )}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <FaBuilding className="mr-3 text-gray-400 w-4" />
                  <span className="text-gray-600">Department:</span>
                  <span className="ml-2 font-medium text-gray-900">{job.department.name}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3 text-gray-400 w-4" />
                  <span className="text-gray-600">Posted:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(job.posted_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUserTie className="mr-3 text-gray-400 w-4" />
                  <span className="text-gray-600">Recruiter:</span>
                  <span className="ml-2 font-medium text-gray-900">{job.recruiter_name}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-3 text-gray-400 w-4" />
                    <span className="text-gray-600">Salary:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      ${job.salary.toLocaleString()}/year
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Application Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
              {applied ? (
                <div className="flex items-center text-green-600">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-medium">You have applied for this position</span>
                </div>
              ) : (
                <div className="text-gray-600">
                  <p className="mb-3">You haven't applied for this position yet.</p>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {applying ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <FaBriefcase className="mr-2" />
                        Apply Now
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
