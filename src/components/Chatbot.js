// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from "react";
import { IoIosSend, IoMdCopy, IoMdRefresh, IoMdMoon, IoMdSunny } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateContent } from "./Model";
import FirebaseAuth from "./FirebaseAuth";  // ← NEW
import { auth, onAuthStateChanged } from "../firebase";  // ← NEW
import "./Chatbot.css";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages, isLoading]);
  useEffect(() => inputRef.current?.focus(), []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Optional: Load saved chat
        const saved = localStorage.getItem(`chat_${firebaseUser.uid}`);
        if (saved) setMessages(JSON.parse(saved));
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Save chat when messages change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`chat_${user.uid}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const handleSubmit = async (retry = false) => {
    if (isLoading) return;
    const prompt = userInput.trim();
    if (!prompt && !retry) return;

    if (!retry) {
      setMessages((prev) => [...prev, { type: "user", content: prompt }]);
      setUserInput("");
    }

    setIsLoading(true);
    setMessages((prev) => [...prev, { type: "bot", content: "", isTyping: true }]);

    try {
      const text = await generateContent(prompt || messages[messages.length - 2]?.content);
      setMessages((prev) => {
        const newMsgs = retry ? prev.slice(0, -1) : prev.slice(0, -1);
        return [...newMsgs, { type: "bot", content: text }];
      });
    } catch (err) {
      const msg = err.message.includes("API key") ? "Invalid API key" : "Try again.";
      setMessages((prev) => {
        const newMsgs = retry ? prev.slice(0, -1) : prev.slice(0, -1);
        return [...newMsgs, { type: "bot", content: `Warning: ${msg}`, isError: true }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const regenerate = () => {
    const lastUserIndex = messages.findLastIndex((m) => m.type === "user");
    if (lastUserIndex !== -1) {
      const prompt = messages[lastUserIndex].content;
      setMessages(messages.slice(0, lastUserIndex + 1));
      setUserInput(prompt);
      handleSubmit(true);
    }
  };

  const TypingDots = () => (
    <div className="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  );

  return (
    <div className={`chat-app ${darkMode ? "dark" : ""}`}>
      <header className="chat-header">
        <div className="header-left">
          <div className="logo">K2I</div>
          <span className="status">HEY-HII</span>
        </div>
        <div className="header-right">
          <FirebaseAuth user={user} onLogin={setUser} onLogout={() => setUser(null)} />
          {!user && (
            <>
              <button onClick={regenerate} className="icon-btn" title="Regenerate">
                <IoMdRefresh />
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="icon-btn">
                {darkMode ? <IoMdSunny /> : <IoMdMoon />}
              </button>
            </>
          )}
        </div>
      </header>

      <section className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome">
            <h1>Hello! </h1>
            <p>Ask me anything!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message-wrapper ${msg.type} ${msg.isError ? "error" : ""}`}>
              <div className={`message ${msg.type}`}>
                {msg.isTyping ? <TypingDots /> : (
                  <>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    {msg.type === "bot" && !msg.isError && (
                      <button onClick={() => copyText(msg.content)} className="copy-btn">
                        <IoMdCopy />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </section>

      <div className="input-container">
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gemini..."
          rows={1}
          className="chat-input"
          disabled={isLoading}
        />
        <button onClick={() => handleSubmit()} disabled={isLoading || !userInput.trim()} className="send-btn">
          {isLoading ? <div className="spinner"></div> : <IoIosSend />}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;