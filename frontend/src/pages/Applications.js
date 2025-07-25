import React, { useEffect, useState } from "react";
import { api } from "../api";
import { BriefcaseIcon } from "@heroicons/react/24/outline"; // optional, needs heroicons

export default function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api("/api/applications/").then(setApps);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>

      {apps.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((a) => (
            <div
              key={a.application_id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {a.job.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Department: <span className="text-gray-700">{a.job.department}</span>
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                Applied on:{" "}
                <span className="text-gray-700 font-medium">{a.date_applied}</span>
              </p>

              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                  ${
                    a.status === "Selected"
                      ? "bg-green-100 text-green-700"
                      : a.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
