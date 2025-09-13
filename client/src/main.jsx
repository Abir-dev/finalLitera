import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import "./index.css"; // tailwind import
import { Toaster } from "react-hot-toast";
// import {
//   fixSvgAttributes,
//   initSvgObserver,
//   suppressSvgErrors,
// } from "./utils/svgUtils.js";

// // Initialize SVG utilities
// suppressSvgErrors();
// fixSvgAttributes();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <App />
          <Toaster position="top-right" />
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Initialize SVG observer after DOM is ready
setTimeout(() => {
  // initSvgObserver();
}, 100);
