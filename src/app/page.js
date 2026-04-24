"use client";
import API from "./utils/api";

import { useEffect, useState } from "react";
import DashboardPage from "./componets/DashboardPage";

export default function Page() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // removed — using API instance instead

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async () => {
    if (!name || !phone) {
      alert("Please enter both name and phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/users/login", { name, phone });
      const data = res.data;  

      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role); // ✅ ADDED

      setUser(data.user);

      window.dispatchEvent(new Event("loginStatusChanged"));

    } catch (err) {
      console.error(err);
      alert(err.message || "Could not log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <DashboardPage />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #00a884 0%, #075e54 100%)",
        fontFamily: "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          borderRadius: "32px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#00a884",
            padding: "32px 24px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#ffffff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 2.09.64 4.04 1.74 5.66L2 22l4.34-1.74C7.96 21.36 9.91 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#00a884" />
              <path d="M12 4c4.42 0 8 3.58 8 8s-3.58 8-8 8c-1.88 0-3.62-.65-5-1.74L6 18l1.74-1.74C7.35 15.62 7 14.88 7 14c0-3.31 2.69-6 6-6h-1v2h1c2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.45 0-2.73-.77-3.44-1.94L8 16l1.06-1.06c.61.67 1.49 1.06 2.44 1.06 1.66 0 3-1.34 3-3s-1.34-3-3-3h-1V6h1c1.66 0 3 1.34 3 3s-1.34 3-3 3z" fill="#ffffff" />
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.3px" }}>
            WhatsApp Chat
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "32px 28px 36px" }}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "16px",
                border: "1.5px solid #e5e7eb",
                borderRadius: "24px",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                background: "#f9fafb",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#00a884"; e.target.style.background = "#ffffff"; }}
              onBlur={(e) => { if (!e.target.value) { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; } }}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g. 919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "16px",
                border: "1.5px solid #e5e7eb",
                borderRadius: "24px",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                background: "#f9fafb",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#00a884"; e.target.style.background = "#ffffff"; }}
              onBlur={(e) => { if (!e.target.value) { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; } }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: 600,
              background: loading ? "#ccc" : "#00a884",
              color: "#ffffff",
              border: "none",
              borderRadius: "40px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.1s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#008f72"; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#00a884"; }}
          >
            {loading ? (
              <span style={{ display: "inline-block", width: "20px", height: "20px", border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", verticalAlign: "middle" }} />
            ) : (
              "Start Chatting →"
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "24px", marginBottom: 0 }}>
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}