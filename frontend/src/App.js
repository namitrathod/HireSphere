import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import LoginPage from "./components/Login";
import JobsList from "./pages/JobsList";
import JobDetail from "./pages/JobDetail";
import Applications from "./pages/Applications";
import Interviews from "./pages/Interviews";
import Decisions from "./pages/Decisions";
import SignupPage from "./pages/Signuppage";
import NavBar from "./components/NavBar";
import TestPage from "./pages/TestPage";

// Recruiter page imports
import DashboardPage from "./recruiter/pages/DashboardPage";
import InterviewsPage from "./recruiter/pages/InterviewsPage";
import DecisionsPage from "./recruiter/pages/DecisionsPage";
import ShortlistedPage from "./recruiter/pages/ShortlistedPage";
import ScheduleInterviewPage from "./recruiter/pages/ScheduleInterviewPage";
import ViewApplicationPage from "./recruiter/pages/ViewApplicationPage";
import RecruiterNavBar from "./recruiter/components/RecruiterNavBar";

// Admin page imports
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import UsersPage from "./admin/pages/UsersPage";
import JobsPage from "./admin/pages/JobsPage";
import ApplicationsPage from "./admin/pages/ApplicationsPage";
import AdminInterviewsPage from "./admin/pages/InterviewsPage";
import AdminDecisionsPage from "./admin/pages/DecisionsPage";
import AdminNavBar from "./admin/components/AdminNavBar";

function AppRoutes() {
  const isLoggedIn = !!sessionStorage.getItem("userRole");
  const location = useLocation();

  const hideNavOn = ["/login", "/signup", "/test"];
  const shouldHideNav = hideNavOn.includes(location.pathname);
  
  // Check if current route is recruiter route
  const isRecruiterRoute = location.pathname.startsWith("/recruiter/");
  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith("/admin/");

  return (
    <>
      {!shouldHideNav && isLoggedIn && (
        isRecruiterRoute ? <RecruiterNavBar /> : 
        isAdminRoute ? <AdminNavBar /> : 
        <NavBar />
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        {isLoggedIn ? (
          <>
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/decisions" element={<Decisions />} />
            <Route path="*" element={<Navigate to="/jobs" replace />} />

            <Route path="/recruiter/dashboard" element={<DashboardPage />} />
            <Route path="/recruiter/interviews" element={<InterviewsPage />} />
            <Route path="/recruiter/decisions" element={<DecisionsPage />} />
            <Route path="/recruiter/shortlisted" element={<ShortlistedPage />} />
            <Route path="/recruiter/schedule-interview/:candidateId" element={<ScheduleInterviewPage />} />
            <Route path="/recruiter/view-application/:applicationId" element={<ViewApplicationPage />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/jobs" element={<JobsPage />} />
            <Route path="/admin/applications" element={<ApplicationsPage />} />
            <Route path="/admin/interviews" element={<AdminInterviewsPage />} />
            <Route path="/admin/decisions" element={<AdminDecisionsPage />} />

          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


// import {React, useState, useEffect} from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import LoginPage    from "./pages/LoginPage";
// import JobsList     from "./pages/JobsList";
// import JobDetail    from "./pages/JobDetail";
// import Applications from "./pages/Applications";
// import Interviews   from "./pages/Interviews";
// import Decisions    from "./pages/Decisions";
// import SignupPage   from "./pages/Signuppage";
// import NavBar       from "./components/NavBar";
// import Login from "./components/Login";
// // ...



// export default function App() {
//   /* 1️⃣  keep auth flag in state */
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     !!sessionStorage.getItem("userRole")
//   );

//   /* 2️⃣  update flag whenever sessionStorage changes */
//   useEffect(() => {
//     function syncAuthFlag() {
//       setIsLoggedIn(!!sessionStorage.getItem("userRole"));
//     }
//     // fires for this tab (Login.js) and other tabs
//     window.addEventListener("storage", syncAuthFlag);
//     return () => window.removeEventListener("storage", syncAuthFlag);
//   }, []);

//   return (
//     <BrowserRouter>
//       {isLoggedIn && <NavBar />}
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         {/* <Route path="/login"       element={<LoginPage />} /> */}
//         <Route path="/signup"      element={<SignupPage />} />

//         {isLoggedIn ? (
//           <>
//             <Route path="/jobs"            element={<JobsList />} />
//             <Route path="/jobs/:id"        element={<JobDetail />} />
//             <Route path="/applications"    element={<Applications />} />
//             <Route path="/interviews"      element={<Interviews />} />
//             <Route path="/decisions"       element={<Decisions />} />
//             <Route path="*"                element={<Navigate to="/jobs" replace />} />
//           </>
//         ) : (
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         )}
//       </Routes>
//     </BrowserRouter>
//   );
// }
