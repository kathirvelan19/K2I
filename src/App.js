// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AuthPage from "./pages/AuthPage";
import Chatbot from "./components/Chatbot";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div style={{background:"#667eea", color:"white", height:"100vh", display:"grid", placeItems:"center", fontSize:"2rem"}}>K2I</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <AuthPage />} />
        <Route path="/chat" element={user ? <Chatbot /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
