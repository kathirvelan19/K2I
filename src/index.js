import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// SUPPRESS FIREBASE POPUP ERROR IN DEV
if (process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Pending promise was never set")
    ) {
      return; // suppress
    }
    originalError(...args);
  };

  window.addEventListener("unhandledrejection", (e) => {
    if (e.reason?.message?.includes("Pending promise was never set")) {
      e.preventDefault();
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();