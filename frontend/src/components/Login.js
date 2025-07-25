// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// // Helper function to get a cookie by name.
// function getCookie(name) {
//   let cookieValue = null;
//   if (document.cookie && document.cookie !== "") {
//     const cookies = document.cookie.split("; ");
//     for (let cookie of cookies) {
//       if (cookie.startsWith(name + "=")) {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }
// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Get the CSRF token from the cookie.
//     const csrftoken = getCookie("csrftoken");

//     // Prepare form-encoded data
//     const formData = new URLSearchParams();
//     formData.append("username", email);
//     formData.append("password", password);

//     const response = await fetch("http://localhost:8000/login/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "X-CSRFToken": csrftoken,
//       },
//       body: formData,
//       credentials: "include", // include cookies
//     });

// const data = await response.json();

//     if (data.success) {
//       sessionStorage.setItem('userRole', data.role);
//       navigate("/jobs"); // Use React Router navigation
//     } else {
//       alert(data.error || "Login failed!");
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-card">
//         <h1 className="text-3xl font-bold text-blue-600">Tailwind is working!</h1>
//         <h2>Login to Your Account</h2>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

// src/components/Login.js
// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage"; // 💡 Your UI component

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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const csrftoken = getCookie("csrftoken");

    const formData = new URLSearchParams();
    formData.append("username", email); // Django uses username
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": csrftoken,
        },
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      console.log("🔁 Login response:", data);

      if (data.success) {
        sessionStorage.setItem("userRole", data.role);
        sessionStorage.setItem("username", data.name);
        navigate("/jobs");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <LoginPage
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      handleSubmit={handleSubmit}
    />
  );
}

