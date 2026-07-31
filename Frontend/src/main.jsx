import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";              // Tailwind
import "./styles/globals.css";     // Global fonts & base styles
import "./styles/animations.css";  // Reusable animations

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);