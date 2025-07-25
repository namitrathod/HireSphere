import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/api/jobs/${id}/`).then(setInfo);
  }, [id]);

  if (!info)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 text-lg">
        Loading job details…
      </div>
    );

  const { job, applied } = info;

  const apply = () => {
    setBusy(true);
    api(`/api/jobs/${id}/apply/`, { method: "POST" })
      .then(() => navigate("/applications"))
      .finally(() => setBusy(false));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.title}</h1>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Department:</span>{" "}
            {job.department.name}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {job.description}
          </p>
          <p>
            <span className="font-semibold">Requirements:</span>{" "}
            {job.requirements}
          </p>
          <p>
            <span className="font-semibold">Salary:</span>{" "}
            {job.salary ? `$${job.salary}` : "—"}
          </p>
        </div>

        <div className="mt-6">
          {applied ? (
            <div className="text-blue-600 font-medium">
              You have already applied for this job.
            </div>
          ) : (
            <button
              onClick={apply}
              disabled={busy}
              className={`px-6 py-2 rounded-md text-white font-semibold transition ${
                busy
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {busy ? "Submitting…" : "Apply Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
