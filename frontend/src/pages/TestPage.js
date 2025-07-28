import React, { useState, useEffect } from 'react';
import { testAPI, jobAPI, applicationAPI } from '../api';

const TestPage = () => {
  const [testResult, setTestResult] = useState(null);
  const [jobsResult, setJobsResult] = useState(null);
  const [applicationsResult, setApplicationsResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({});

  useEffect(() => {
    // Get session storage info
    setSessionInfo({
      username: sessionStorage.getItem("username"),
      userRole: sessionStorage.getItem("userRole"),
      isLoggedIn: !!sessionStorage.getItem("userRole")
    });
  }, []);

  const runTests = async () => {
    setLoading(true);
    try {
      // Test basic API connection
      const testData = await testAPI.testData();
      setTestResult(testData);

      // Test jobs API
      try {
        const jobs = await jobAPI.getJobs();
        setJobsResult({ success: true, data: jobs });
      } catch (error) {
        setJobsResult({ success: false, error: error.message });
      }

      // Test applications API
      try {
        const applications = await applicationAPI.getApplications();
        setApplicationsResult({ success: true, data: applications });
      } catch (error) {
        setApplicationsResult({ success: false, error: error.message });
      }
    } catch (error) {
      setTestResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      {/* Session Info */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h2 className="text-xl font-semibold mb-2">Session Information</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(sessionInfo, null, 2)}
        </pre>
      </div>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
      >
        {loading ? 'Running Tests...' : 'Run API Tests'}
      </button>

      <div className="space-y-6">
        {/* Test Data Result */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Test Data</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {testResult ? JSON.stringify(testResult, null, 2) : 'No test data yet'}
          </pre>
        </div>

        {/* Jobs API Result */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Jobs API</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {jobsResult ? JSON.stringify(jobsResult, null, 2) : 'No jobs data yet'}
          </pre>
        </div>

        {/* Applications API Result */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Applications API</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {applicationsResult ? JSON.stringify(applicationsResult, null, 2) : 'No applications data yet'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 