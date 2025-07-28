import React, { useState, useEffect } from "react";

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      const response = await fetch("/api/admin/decisions/");
      if (response.ok) {
        const data = await response.json();
        setDecisions(data);
      } else {
        console.error("Failed to fetch decisions");
      }
    } catch (error) {
      console.error("Error fetching decisions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeDecision = async (appId, decision) => {
    try {
      const response = await fetch(`/api/admin/decisions/${appId}/make/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ decision }),
      });
      
      if (response.ok) {
        fetchDecisions();
        alert(`Decision made: ${decision}`);
      } else {
        const error = await response.json();
        alert("Error: " + error.error);
      }
    } catch (error) {
      console.error("Error making decision:", error);
      alert("Error making decision");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading decisions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Decision Management</h1>
      </div>

      {/* Decisions Table */}
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
                Decision
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Decision Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {decisions.map(decision => (
              <tr key={decision.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{decision.applicant}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{decision.job_title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    decision.decision === 'Hired' ? 'bg-green-100 text-green-800' :
                    decision.decision === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {decision.decision}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{decision.decision_date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleMakeDecision(decision.id, "Hired")}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleMakeDecision(decision.id, "Rejected")}
                    className="text-red-600 hover:text-red-900"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {decisions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No decisions found.</p>
        </div>
      )}
    </div>
  );
} 