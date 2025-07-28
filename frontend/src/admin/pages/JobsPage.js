import React, { useState, useEffect } from "react";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    department_id: "",
    description: "",
    posted_date: new Date().toISOString().split('T')[0],
    skills: "",
    min_experience: "",
    min_qualification: ""
  });

  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/admin/jobs/");
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments/");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/jobs/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createForm),
      });
      
      if (response.ok) {
        setShowCreateForm(false);
        setCreateForm({
          title: "",
          department_id: "",
          description: "",
          posted_date: new Date().toISOString().split('T')[0],
          skills: "",
          min_experience: "",
          min_qualification: ""
        });
        fetchJobs();
        alert("Job created successfully!");
      } else {
        const error = await response.json();
        alert("Error: " + error.error);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Error creating job");
    }
  };

  const handleJobAction = async (jobId, action) => {
    try {
      if (action === "delete") {
        const response = await fetch(`/api/admin/jobs/${jobId}/delete/`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          fetchJobs();
          alert("Job deleted successfully!");
        } else {
          const error = await response.json();
          alert("Error: " + error.error);
        }
      } else {
        const response = await fetch(`/api/admin/jobs/${jobId}/update/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        });
        
        if (response.ok) {
          fetchJobs();
          alert(`Job ${action}d successfully!`);
        } else {
          const error = await response.json();
          alert("Error: " + error.error);
        }
      }
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Error updating job");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Job
        </button>
      </div>

      {/* Create Job Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Job</h3>
            <form onSubmit={handleCreateJob}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Department</label>
                <select
                  value={createForm.department_id}
                  onChange={(e) => setCreateForm({...createForm, department_id: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Posted Date</label>
                <input
                  type="date"
                  value={createForm.posted_date}
                  onChange={(e) => setCreateForm({...createForm, posted_date: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Required Skills</label>
                <input
                  type="text"
                  value={createForm.skills}
                  onChange={(e) => setCreateForm({...createForm, skills: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Python, React, SQL"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Min Experience (years)</label>
                <input
                  type="number"
                  value={createForm.min_experience}
                  onChange={(e) => setCreateForm({...createForm, min_experience: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Min Qualification</label>
                <input
                  type="text"
                  value={createForm.min_qualification}
                  onChange={(e) => setCreateForm({...createForm, min_qualification: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Bachelor's Degree"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recruiter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posted Date
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
            {jobs.map(job => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.recruiter}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.posted_date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {job.status === "Open" ? (
                    <button
                      onClick={() => handleJobAction(job.id, "deactivate")}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJobAction(job.id, "activate")}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Open
                    </button>
                  )}
                  <button
                    onClick={() => handleJobAction(job.id, "delete")}
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
    </div>
  );
} 