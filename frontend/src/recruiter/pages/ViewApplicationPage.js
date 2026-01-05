import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import { recruiterAPI } from '../../api';

const ViewApplicationPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recruiterAPI.getApplicationDetails(applicationId);
        setApplication(data);
      } catch (err) {
        console.error('Error fetching application details:', err);
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleShortlist = async () => {
    try {
      if (!window.confirm("Are you sure you want to shortlist this candidate?")) return;
      await recruiterAPI.updateStatus(applicationId, 'Shortlisted');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to shortlist candidate.");
    }
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Application</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/recruiter/shortlisted")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Shortlisted
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application not found</h3>
          <button
            onClick={() => navigate("/recruiter/shortlisted")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Shortlisted
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
              <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
              <p className="mt-2 text-gray-600">View candidate application and profile</p>
            </div>
            <div className="flex space-x-3 items-center">
              {application.application.ai_score !== undefined && (
                <div className={`mr-2 px-3 py-1 rounded-full text-sm font-bold border ${application.application.ai_score >= 70 ? 'bg-green-50 text-green-700 border-green-200' :
                  application.application.ai_score >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                  AI Match: {Math.round(application.application.ai_score)}%
                </div>
              )}
              {application.application.status === 'Pending' && (
                <button
                  onClick={handleShortlist}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                >
                  <FaBriefcase className="mr-2" /> Shortlist Candidate
                </button>
              )}
              <button
                onClick={() => navigate(`/recruiter/schedule-interview/${applicationId}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidate Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{application.candidate.name}</h2>
                  <p className="text-sm text-gray-500">{application.job.title}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(application.application.status)}`}>
                    {application.application.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{application.candidate.email}</span>
                </div>
                {application.candidate.phone && (
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{application.candidate.phone}</span>
                  </div>
                )}
                {application.candidate.location && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{application.candidate.location}</span>
                  </div>
                )}
                {application.candidate.education && (
                  <div className="flex items-center">
                    <FaGraduationCap className="text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{application.candidate.education}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <FaBriefcase className="text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{application.candidate.experience || 'Not specified'} experience</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {application.candidate.skills && application.candidate.skills.length > 0 ? (
                    application.candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No skills specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-medium text-gray-900">{application.job.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">{application.job.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posted Date</p>
                  <p className="font-medium text-gray-900">{application.job.posted_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Applied Date</p>
                  <p className="font-medium text-gray-900">{application.application.applied_date}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Job Description</p>
                <p className="text-gray-900 mt-1">{application.job.description}</p>
              </div>
            </div>

            {/* Cover Letter */}
            {application.application.cover_letter && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{application.application.cover_letter}</p>
                </div>
              </div>
            )}

            {/* Resume & AI Insights */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume & AI Insights</h2>

              {/* Download Button */}
              {application.application.resume_url ? (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                  <div className="flex items-center">
                    <FaBriefcase className="text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Original Resume (PDF)</p>
                      <p className="text-xs text-blue-700">Uploaded by candidate</p>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:8000${application.application.resume_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    View / Download
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-gray-100 rounded-lg text-gray-500 text-sm mb-6 italic">
                  No resume file uploaded.
                </div>
              )}

              {/* AI Parsed Data */}
              {application.application.parsed_data && Object.keys(application.application.parsed_data).length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                      ✨ AI Analysis
                    </span>
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-700 overflow-auto max-h-64">
                    <pre>{JSON.stringify(application.application.parsed_data, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* AI Score Breakdown */}
            {application.application.score_details && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2">📊</span>
                  AI Match Breakdown
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* 1. Skills */}
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">Skills (40%)</p>
                    <p className="text-xl font-bold text-gray-900">{application.application.score_details.skills_score} pts</p>
                  </div>

                  {/* 2. Experience */}
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">Experience (30%)</p>
                    <p className="text-xl font-bold text-gray-900">{application.application.score_details.experience_score} pts</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {application.application.score_details.candidate_experience}y / {application.application.score_details.required_experience}y req
                    </p>
                  </div>

                  {/* 3. Education (NEW) */}
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">Education (15%)</p>
                    <p className="text-xl font-bold text-gray-900">{application.application.score_details.education_score || 0} pts</p>
                  </div>

                  {/* 4. AI Vibe Check (NEW) */}
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">AI Vibe (15%)</p>
                    <p className="text-xl font-bold text-gray-900">{application.application.score_details.ai_score || 0} pts</p>
                  </div>
                </div>

                {/* Matching Skills */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">✅ Matching Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.application.score_details.matching_skills && application.application.score_details.matching_skills.length > 0 ? (
                      application.application.score_details.matching_skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 italic">No direct matches found.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">❌ Missing / Unmatched from Job</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.application.score_details.missing_skills && application.application.score_details.missing_skills.length > 0 ? (
                      application.application.score_details.missing_skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full border border-red-100">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 italic">None. All requirements met!</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Candidate Summary */}
            {application.candidate.summary && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{application.candidate.summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicationPage;
