const API_BASE_URL = 'http://localhost:8000';

// Helper function to get CSRF token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const csrftoken = getCookie("csrftoken");
  
  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  };

  try {
    console.log(`Making API call to: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`API response for ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const csrftoken = getCookie("csrftoken");
    
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrftoken,
      },
      body: formData,
      credentials: "include",
    });

    return response.json();
  },

  signup: async (userData) => {
    const formData = new URLSearchParams();
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key]);
    });

    const csrftoken = getCookie("csrftoken");
    
    const response = await fetch(`${API_BASE_URL}/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrftoken,
      },
      body: formData,
      credentials: "include",
    });

    return response.json();
  },

  logout: async () => {
    return apiCall('/logout/', { method: 'POST' });
  },
};

// Job API
export const jobAPI = {
  getJobs: () => apiCall('/api/jobs/'),
  getJobDetail: (id) => apiCall(`/api/jobs/${id}/`),
  applyForJob: (id) => apiCall(`/api/jobs/${id}/apply/`, { method: 'POST' }),
};

// Application API
export const applicationAPI = {
  getApplications: () => apiCall('/api/applications/'),
  getInterviews: () => apiCall('/api/interviews/'),
  getDecisions: () => apiCall('/api/decisions/'),
};

// Interview API (for user pages)
export const interviewAPI = {
  getInterviews: () => apiCall('/api/interviews/'),
};

// Decision API (for user pages)
export const decisionAPI = {
  getDecisions: () => apiCall('/api/decisions/'),
};

// Recruiter API
export const recruiterAPI = {
  // Dashboard
  getDashboardStats: () => apiCall('/api/recruiter/dashboard/'),
  
  // Shortlisted applications
  getShortlistedApplications: () => apiCall('/api/recruiter/shortlisted/'),
  
  // Interviews
  getInterviews: () => apiCall('/api/recruiter/interviews/'),
  scheduleInterview: (appId, interviewData) => 
    apiCall(`/api/recruiter/schedule/${appId}/`, {
      method: 'POST',
      body: JSON.stringify(interviewData),
    }),
  
  // Decisions
  getDecisions: () => apiCall('/api/recruiter/decisions/'),
  makeDecision: (appId, decision) => 
    apiCall(`/api/recruiter/decision/${appId}/`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    }),
  
  // Applications
  getApplicationDetails: (appId) => apiCall(`/api/recruiter/applications/${appId}/`),
};

// Test API
export const testAPI = {
  testConnection: () => apiCall('/api/test/'),
  testData: () => apiCall('/api/test-data/'),
};
