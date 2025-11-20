// src/pages/AuthPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import { Mail, Lock, User, Chrome } from "lucide-react";
import "../auth.css"; // we'll create this next

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/chat");
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/chat");
    } catch (err) {
      alert("Google login failed");
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-container">
      <h1 className="auth-title">{isLogin ? "Welcome Back" : "Join K2I"}</h1>
      <p className="auth-subtitle">{isLogin ? "Log in to continue" : "Create your account"}</p>

      <form onSubmit={handleEmailAuth}>
        {!isLogin && (
          <div className="form-group">
            <input type="text" required placeholder=" " onChange={(e) => setName(e.target.value)} />
            <label>Full Name</label>
            <User size={20} />
          </div>
        )}
        <div className="form-group">
          <input type="email" required placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Email</label>
          <Mail size={20} />
        </div>
        <div className="form-group">
          <input type="password" required placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} />
          <label>Password</label>
          <Lock size={20} />
        </div>
        <button className="btn-primary" disabled={loading}>
          {loading ? "Please wait..." : (isLogin ? "Log In" : "Sign Up")}
        </button>
      </form>

      <button onClick={handleGoogle} className="btn-primary btn-google" disabled={loading}>
        <Chrome size={20} /> Continue with Google
      </button>

      <div className="auth-link">
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "#a78bfa" }}>
            {isLogin ? "Sign up" : "Log in"}
          </a>
        </p>
      </div>
    </motion.div>
  );
}
