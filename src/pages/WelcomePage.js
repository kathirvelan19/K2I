// src/pages/WelcomePage.js
import React from "react";
import FirebaseAuth from "../components/FirebaseAuth";
import "./WelcomePage.css";

const WelcomePage = ({ onLogin }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1 className="title-gradient">
          Hello! Welcome to <span>K2HEYI</span>
        </h1>
        <p className="subtitle">Your AI Companion – Powered by Gemini</p>

        <div className="auth-box">
          <FirebaseAuth
            user={null}
            onLogin={onLogin}
            onLogout={() => {}}
          />
        </div>

        <footer className="footer">
          © 2025 K2HEYI – All Rights Reserved
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;