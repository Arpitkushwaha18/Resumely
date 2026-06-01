import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import "./builder.css";
import BuilderApp from "./BuilderApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BuilderApp />
  </StrictMode>,
);
