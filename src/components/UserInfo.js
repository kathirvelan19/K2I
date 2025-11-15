// src/components/UserInfo.js
import React, { useState, useEffect } from "react";

const UserInfo = () => {
  const [time, setTime] = useState("");
  const [country] = useState("IN"); // Hardcoded as per user

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(istTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontSize: "0.8rem",
        color: "rgba(255,255,255,0.8)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontWeight: "500",
      }}
    >
      <span>Time: {time} IST</span>
      <span>Country: India</span>
    </div>
  );
};

export default UserInfo;