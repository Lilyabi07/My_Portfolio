import axios from "axios";

const api = axios.create({
  baseURL: "/api", // use Vite proxy in development (vite.config.ts) or relative path in production
  headers: { "Content-Type": "application/json" },
  withCredentials: false // set to true only if backend uses cookies/auth that require credentials
});

// Call setAuthToken(token) after login to add the Bearer token to every request.
// Call setAuthToken() with no args to remove the header.
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;