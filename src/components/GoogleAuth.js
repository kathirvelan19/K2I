// src/components/GoogleAuth.js
import { useEffect, useState } from "react";

const GoogleAuth = ({ onLogin, onLogout }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const check = setInterval(() => {
      if (window.googleScriptLoaded) {
        setLoaded(true);
        clearInterval(check);
        initGoogle();
      }
    }, 100);
    return () => clearInterval(check);
  }, []);

  const initGoogle = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (resp) => {
        const payload = parseJwt(resp.credential);
        const user = {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          token: resp.credential,
        };
        localStorage.setItem("googleUser", JSON.stringify(user));
        onLogin(user);
      },
    });

    // Auto-login
    const saved = localStorage.getItem("googleUser");
    if (saved) onLogin(JSON.parse(saved));

    // Render hidden button
    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInBtn"),
      { theme: "outline", size: "large" }
    );
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return {};
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("googleUser");
    window.google.accounts.id.disableAutoSelect();
    onLogout();
  };

  if (!loaded) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div id="googleSignInBtn" style={{ display: "none" }}></div>
      <button
        onClick={handleLogout}
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          fontSize: "0.85rem",
          cursor: "pointer",
          opacity: 0.8,
        }}
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
};


export default GoogleAuth;