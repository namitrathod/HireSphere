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
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/recruiter/schedule-interview/${applicationId}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => navigate("/recruiter/shortlisted")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Shortlisted
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

            {/* Resume */}
            {application.application.resume && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume</h2>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FaBriefcase className="text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">{application.application.resume}</span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Download
                  </button>
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
