import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Interviews() {
  const [its, setIts] = useState([]);

  useEffect(() => {
    api("/api/interviews/").then(setIts);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Scheduled Interviews</h1>

      {its.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          You have no interviews scheduled yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {its.map((i) => (
            <div
              key={i.id}
              className="bg-white rounded-lg border border-gray-100 shadow hover:shadow-lg transition-all duration-200 p-5"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {i.job.title}
              </h3>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-700">Date:</span> {i.date}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium text-gray-700">Time:</span> {i.time}
              </p>

              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full
                  ${
                    i.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : i.status === "Scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {i.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
