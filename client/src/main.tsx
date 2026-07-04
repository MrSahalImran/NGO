import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.tsx";

// Send every relative axios request (e.g. "/api/auth/login") to the backend
// API. On Vercel, set VITE_API_URL to the deployed backend URL; falls back to
// localhost for local dev. Absolute URLs passed elsewhere are unaffected.
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
