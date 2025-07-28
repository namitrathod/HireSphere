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
        
        // Role-based navigation
        const role = data.role;
        if (role === "RECRUITER") {
          navigate("/recruiter/dashboard");
        } else if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (role === "JOBSEEKER") {
          navigate("/applicant/dashboard");
        } else {
          // Fallback for unknown roles
          navigate("/jobs");
        }
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

