import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./builder/builder.css";
import App from "./App.jsx";

if (window.location.pathname === "/builder") {
  window.location.replace(`/builder/${window.location.search}${window.location.hash}`);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
