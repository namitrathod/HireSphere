import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaCheckCircle, FaSearch, FaFilter, FaBell } from 'react-icons/fa';
import { recruiterAPI } from '../../api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    shortlisted_count: 0,
    interviews_count: 0,
    decisions_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setSearching(true);
    try {
      const results = await recruiterAPI.searchCandidates({ q: searchQuery });
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recruiterAPI.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const dashboardCards = [
    {
      title: "Shortlisted Candidates",
      count: stats.shortlisted_count,
      icon: <FaUsers className="text-blue-500" />,
      description: "Candidates who passed screening",
      action: () => navigate("/recruiter/shortlisted"),
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Scheduled Interviews",
      count: stats.interviews_count,
      icon: <FaCalendarAlt className="text-green-500" />,
      description: "Upcoming interview sessions",
      action: () => navigate("/recruiter/interviews"),
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Hiring Decisions",
      count: stats.decisions_count,
      icon: <FaCheckCircle className="text-purple-500" />,
      description: "Completed hiring decisions",
      action: () => navigate("/recruiter/decisions"),
      color: "bg-purple-50 border-purple-200"
    }
  ];

  /* ... Loading/Error checks ... */
  if (loading) { return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>; }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your hiring process and candidate pipeline</p>
          </div>
          {/* <div className="flex space-x-3">
            <button
              onClick={() => navigate('/recruiter/post-job')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
            >
              <span className="mr-2 text-xl font-bold">+</span> Post Job
            </button>
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow px-3 py-2">
              <FaBell className="text-gray-500" />
            </div>
          </div> */}
        </div>

        {/* --- SEARCH SECTION --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 transition-all hover:shadow-md">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by skill, name, or email (e.g. 'Python', 'React')..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors flex items-center disabled:opacity-50"
            >
              {searching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <FaSearch className="mr-2" />
              )}
              Search
            </button>
          </form>

          {/* Search Results Display */}
          {searchResults && (
            <div className="mt-6 animate-fade-in-up border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Found {searchResults.length} Candidates
                </h3>
                <button onClick={() => setSearchResults(null)} className="text-sm text-red-500 hover:underline hover:text-red-700 font-medium">(Clear Results)</button>
              </div>
              {searchResults.length === 0 ? (
                <p className="text-gray-500 italic">No candidates found matching "{searchQuery}"</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map(c => (
                    <div key={c.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50" onClick={() => navigate(`/recruiter/view-application/${c.id}`)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900">{c.name}</p>
                          <p className="text-sm text-gray-600">{c.job_title}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === 'Shortlisted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.skills && c.skills.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-xs bg-white border border-gray-300 px-2 py-1 rounded-full text-gray-600">
                            {s}
                          </span>
                        ))}
                        {c.skills && c.skills.length > 3 && <span className="text-xs text-gray-400">+{c.skills.length - 3} more</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border-2 ${card.color} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={card.action}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.count}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className="text-4xl">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Inbound Applications</h2>
          {stats.recent_applications && stats.recent_applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recent_applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.job_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.score >= 70 ? 'bg-green-100 text-green-800' : (app.score >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')}`}>
                          {Math.round(app.score)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => navigate(`/recruiter/view-application/${app.id}`)} className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  ))}           </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No recent applications.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/recruiter/shortlisted")}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaUsers className="text-blue-500 mr-3" />
              <span className="font-medium">View Shortlisted</span>
            </button>
            <button
              onClick={() => navigate("/recruiter/interviews")}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaCalendarAlt className="text-green-500 mr-3" />
              <span className="font-medium">Schedule Interviews</span>
            </button>
            <button
              onClick={() => navigate("/recruiter/decisions")}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaCheckCircle className="text-purple-500 mr-3" />
              <span className="font-medium">Make Decisions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
