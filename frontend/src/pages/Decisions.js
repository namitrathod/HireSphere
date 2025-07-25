import React, { useEffect, useState } from "react";
import { api } from "../api";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/20/solid";

export default function Decisions() {
  const [decs, setDecs] = useState([]);

  useEffect(() => {
    api("/api/decisions/").then(setDecs);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Hired":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Hired
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
            <ClockIcon className="h-4 w-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Final Decisions</h2>
          <p className="text-gray-600 text-lg mt-1">Status of your reviewed applications</p>
        </header>

        {decs.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            <p className="text-lg">📭 No decisions yet.</p>
            <p className="text-sm mt-2">Once recruiters take action, they will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {decs.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md p-6 transition-all duration-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{d.job_title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Decision Date: <span className="text-gray-700 font-medium">{d.decision_date}</span>
                </p>
                {getStatusBadge(d.final_status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
