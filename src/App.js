// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Chatbot from "./components/Chatbot";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div style={{ height: "100vh", display: "grid", placeItems: "center", background: "#667eea", color: "white", fontSize: "2rem" }}>
      Loading K2I...
    </div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <AuthPage />} />
        <Route path="/chat" element={user ? <Chatbot /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
