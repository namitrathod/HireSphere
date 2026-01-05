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
  const [resumeFile, setResumeFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const openApplyModal = () => {
    setShowModal(true);
  };

  const confirmApply = async () => {
    setApplying(true);
    try {
      await jobAPI.applyForJob(id, resumeFile);
      setApplied(true);
      setApplying(false);
      setShowModal(false);
    } catch (err) {
      setError("Failed to apply for the job");
      setApplying(false);
      setShowModal(false);
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
    <div className="min-h-screen bg-gray-50 relative">
      {/* --- APPLICATION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Complete Application</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimesCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">{job.title}</h4>
                  <p className="text-blue-700 text-xs">{job.department.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Resume (PDF)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-gray-50 group cursor-pointer focus-within:border-blue-500">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <FaBriefcase className="mx-auto h-8 w-8 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                      <span className="block text-sm text-blue-600 font-medium">Click to upload</span>
                      <span className="text-xs text-gray-500">or drag and drop here</span>
                      <p className="text-xs text-gray-400 mt-2 font-medium truncate">
                        {resumeFile ? `Selected: ${resumeFile.name}` : "No file selected"}
                      </p>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your resume will be parsed by our AI to match your skills.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                disabled={applying}
              >
                Cancel
              </button>
              <button
                onClick={confirmApply}
                disabled={applying}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center shadow-lg"
              >
                {applying ? <FaSpinner className="animate-spin mr-2" /> : null}
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}

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

            {/* Header Action Button (Apply) */}
            <div className="ml-6">
              {applied ? (
                <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-medium">Applied</span>
                </div>
              ) : (
                <button
                  onClick={openApplyModal}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center shadow-md"
                >
                  <FaBriefcase className="mr-2" />
                  Apply Now
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

        {/* Job Details Grid */}
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

            {/* Application Status (Sidebar) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
              {applied ? (
                <div className="flex items-center text-green-600">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-medium">You have applied for this position</span>
                </div>
              ) : (
                <div className="text-gray-600">
                  <p className="mb-4">Ready to start your journey? Apply now to get started.</p>
                  <button
                    onClick={openApplyModal}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-md hover:shadow-lg transform active:scale-95 duration-200 flex items-center justify-center"
                  >
                    <FaBriefcase className="mr-2" />
                    Apply Now
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-3">
                    <FaCheckCircle className="inline mr-1" />
                    AI Resume Scoring Included
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
