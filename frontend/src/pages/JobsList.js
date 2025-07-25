import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  useEffect(() => {
    api("/api/jobs/").then((data) => {
      setJobs(data);
      setFilteredJobs(data);
      const uniqueDepts = ["All", ...new Set(data.map((job) => job.department))];
      setDepartments(uniqueDepts);
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

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">Careers</h1>
          <p className="mt-2 text-gray-600 text-lg">
            Explore our current job openings and take the next step in your career.
          </p>
        </header>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white shadow rounded-lg p-4 mb-8">
          <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Department
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
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

          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Title">Job Title</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Link to={`/jobs/${job.id}`} key={job.id}>
              <div className="bg-white rounded-xl shadow hover:shadow-md transition duration-300 p-6 h-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  Department: <span className="text-gray-700">{job.department}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Posted on:{" "}
                  <span className="text-gray-700">{job.posted_date}</span>
                </p>
                <div className="mt-4">
                  <span className="text-blue-600 font-medium text-sm hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No jobs match your filter.</p>
        )}
      </div>
    </div>
  );
}
