// Utility wrapper around fetch that automatically attaches the CSRF token
export function api(url, opts = {}) {
  const csrftoken = document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrftoken="))
    ?.split("=")[1];

  return fetch(`http://localhost:8000${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken || "",
      ...opts.headers,
    },
    ...opts,
  }).then((r) => r.json());
}
