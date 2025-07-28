import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jobAPI } from "../api";
import { 
  FaBriefcase, 
  FaBuilding, 
  FaCalendarAlt, 
  FaSearch,
  FaFilter,
  FaSort
} from "react-icons/fa";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [departments, setDepartments] = useState(["All"]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    jobAPI.getJobs()
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
        const uniqueDepts = ["All", ...new Set(data.map((job) => job.department))];
        setDepartments(uniqueDepts);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load jobs");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...jobs];

    if (selectedDept !== "All") {
      result = result.filter((job) => job.department === selectedDept);
    }

    if (sortOption === "Newest") {
      result.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    } else if (sortOption === "Oldest") {
      result.sort((a, b) => new Date(a.posted_date) - new Date(b.posted_date));
    } else if (sortOption === "Title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredJobs(result);
  }, [selectedDept, sortOption, jobs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Jobs</h2>
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
            Explore Career Opportunities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exciting job openings and take the next step in your professional journey
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <FaFilter className="text-gray-500" />
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FaSort className="text-gray-500" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="Newest">Newest First</option>
                  <option value="Oldest">Oldest First</option>
                  <option value="Title">Job Title</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
            {selectedDept !== "All" && ` in ${selectedDept}`}
          </p>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6 h-full group">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FaBriefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaBuilding className="mr-2 text-gray-400" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          <span>Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                      View Details
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {selectedDept !== "All" 
                ? `No jobs available in ${selectedDept} department.` 
                : "No jobs match your current filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
