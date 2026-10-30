import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./main.css";
import { isConfigured } from "./runtimeConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  isConfigured ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    // Without this, sign-in would redirect to an undefined authority
    <p style={{ padding: "2rem" }}>
      DAIKON is not configured: /config.js is missing or incomplete. See
      &quot;Deployment configuration&quot; in the README.
    </p>
  )
);
