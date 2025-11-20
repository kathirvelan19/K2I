// src/pages/AuthPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import "../auth.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/chat");
    } catch (err) {
      alert(err.message);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    navigate("/chat");
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn-primary">
          {isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>
      <button onClick={googleLogin} className="btn-google">
        Continue with Google
      </button>
      <p className="auth-link">
        {isLogin ? "No account? " : "Have account? "}
        <span onClick={() => setIsLogin(!isLogin)} style={{color:"#a78bfa", cursor:"pointer"}}>
          {isLogin ? "Sign up" : "Log in"}
        </span>
      </p>
    </div>
  );
}
