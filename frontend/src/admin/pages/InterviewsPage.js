import React, { useState, useEffect } from "react";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/admin/interviews/");
      if (response.ok) {
        const data = await response.json();
        setInterviews(data);
      } else {
        console.error("Failed to fetch interviews");
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewAction = async (interviewId, action) => {
    try {
      if (action === "delete") {
        const response = await fetch(`/api/admin/interviews/${interviewId}/delete/`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          fetchInterviews();
          alert("Interview deleted successfully!");
        } else {
          const error = await response.json();
          alert("Error: " + error.error);
        }
      } else {
        const response = await fetch(`/api/admin/interviews/${interviewId}/update/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        });
        
        if (response.ok) {
          fetchInterviews();
          alert(`Interview ${action}d successfully!`);
        } else {
          const error = await response.json();
          alert("Error: " + error.error);
        }
      }
    } catch (error) {
      console.error("Error updating interview:", error);
      alert("Error updating interview");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading interviews...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Interview Management</h1>
      </div>

      {/* Interviews Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interviews.map(interview => (
              <tr key={interview.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{interview.applicant}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{interview.job_title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{interview.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{interview.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    interview.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {interview.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {interview.status === "Scheduled" && (
                    <button
                      onClick={() => handleInterviewAction(interview.id, "cancel")}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => handleInterviewAction(interview.id, "delete")}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {interviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No interviews found.</p>
        </div>
      )}
    </div>
  );
} 