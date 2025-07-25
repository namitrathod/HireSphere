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

function AppRoutes() {
  const isLoggedIn = !!sessionStorage.getItem("userRole");
  const location = useLocation();

  const hideNavOn = ["/login", "/signup"];
  const shouldHideNav = hideNavOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNav && isLoggedIn && <NavBar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {isLoggedIn ? (
          <>
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/decisions" element={<Decisions />} />
            <Route path="*" element={<Navigate to="/jobs" replace />} />
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
