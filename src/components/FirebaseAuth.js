// src/components/FirebaseAuth.js
import React, { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  auth,
  googleProvider,
} from "../firebase"; // correct relative path

const FirebaseAuth = ({ user, onLogin, onLogout }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const fn = isSignup
        ? createUserWithEmailAndPassword
        : signInWithEmailAndPassword;
      const result = await fn(auth, email, password);
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    onLogout();
  };

  /* ---------- LOGGED-IN UI ---------- */
  if (user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.9rem",
        }}
      >
        <img
          src={user.photoURL || "https://via.placeholder.com/32"}
          alt={user.displayName || user.email}
          style={{ width: 32, height: 32, borderRadius: "50%" }}
        />
        <span
          style={{
            maxWidth: "110px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.displayName || user.email}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  /* ---------- LOG-IN / SIGN-UP FORM ---------- */
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontSize: "0.85rem",
        minWidth: "180px",
      }}
    >
      <form
        onSubmit={handleEmail}
        style={{ display: "flex", flexDirection: "column", gap: "4px" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "0.85rem",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "0.85rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "6px",
            background: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <button
        onClick={handleGoogle}
        style={{
          padding: "6px",
          background: "#ea4335",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        Sign in with Google
      </button>

      <button
        type="button"
        onClick={() => setIsSignup(!isSignup)}
        style={{
          background: "none",
          border: "none",
          color: "#4285f4",
          fontSize: "0.8rem",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        {isSignup ? "Already have an account? Sign in" : "No account? Sign up"}
      </button>

      {error && (
        <p
          style={{
            color: "#c62828",
            fontSize: "0.75rem",
            margin: "2px 0",
            wordBreak: "break-word",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FirebaseAuth;