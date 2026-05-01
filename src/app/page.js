"use client";
import API from "./utils/api";
import { useEffect, useState } from "react";
import DashboardPage from "./componets/DashboardPage";

export default function Page() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

 const handleSendOtp = async (e) => {
  if (e) e.preventDefault();
  setError("");

  if (!phone.trim()) { setError("Please enter your phone number."); return; }
  if (!email.trim()) { setError("Please enter your registered email."); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    setError("Please enter a valid email address.");
    return;
  }

  setLoading(true);
  try {
    await API.post("/users/send-otp", { phone: phone.trim(), email: email.trim() });
    setStep(2);
    setResendTimer(30);
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.error || "Failed to send OTP. Try again.";

    // ✅ Show modal for "not found / not allowed / email mismatch" errors
    if (status === 401 || status === 404) {
      setShowNotFoundModal(true);
    } else {
      setError(message);
    }
  } finally {
    setLoading(false);
  }
};

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp || otp.length !== 6) return setError("Please enter the 6-digit OTP.");

    setLoading(true);
    try {
      const res = await API.post("/users/verify-otp", { phone: phone.trim(), otp });
      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      setUser(data.user);
      window.dispatchEvent(new Event("loginStatusChanged"));
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setOtp("");
    setLoading(true);
    try {
      await API.post("/users/send-otp", { phone: phone.trim(), email: email.trim() });
      setResendTimer(30);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (user) return <DashboardPage />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background: #111b21;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* WhatsApp-style pattern background */
        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300a884' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: #202c33;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.06);
        }

        /* Green top strip */
        .card-header {
          background: linear-gradient(160deg, #00a884 0%, #008069 100%);
          padding: 40px 32px 36px;
          text-align: center;
          position: relative;
        }

        .card-header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 28px;
          background: #202c33;
          border-radius: 28px 28px 0 0;
        }

        .wa-icon-wrap {
          width: 72px;
          height: 72px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          backdrop-filter: blur(8px);
          border: 2px solid rgba(255,255,255,0.25);
        }

        .card-title {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }

        .card-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          font-weight: 400;
        }

        /* Body */
        .card-body {
          padding: 28px 28px 32px;
        }

        /* Step dots */
        .step-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 28px;
        }

        .step-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.35s ease;
        }

        .step-dot.active   { background: #00a884; color: #fff; box-shadow: 0 0 0 4px rgba(0,168,132,0.2); }
        .step-dot.done     { background: #00a884; color: #fff; }
        .step-dot.inactive { background: #2a3942; color: #8696a0; }

        .step-line {
          width: 44px;
          height: 2px;
          border-radius: 2px;
          transition: background 0.35s ease;
        }
        .step-line.done   { background: #00a884; }
        .step-line.undone { background: #2a3942; }

        /* Field label */
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #8696a0;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
        }

        /* Input */
        .wa-input {
          width: 100%;
          padding: 14px 18px;
          font-size: 15px;
          font-family: inherit;
          border: 1.5px solid #2a3942;
          border-radius: 14px;
          outline: none;
          background: #111b21;
          color: #e9edef;
          transition: border-color 0.2s, box-shadow 0.2s;
          caret-color: #00a884;
        }

        .wa-input::placeholder { color: #4a5568; }

        .wa-input:focus {
          border-color: #00a884;
          box-shadow: 0 0 0 3px rgba(0,168,132,0.15);
        }

        .wa-input.otp-input {
          font-size: 28px;
          letter-spacing: 12px;
          text-align: center;
          font-weight: 700;
          color: #00a884;
          padding: 16px 18px;
        }

        /* Button */
        .wa-btn {
          width: 100%;
          padding: 15px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          letter-spacing: 0.3px;
        }

        .wa-btn.primary {
          background: #00a884;
          color: #fff;
          box-shadow: 0 4px 16px rgba(0,168,132,0.35);
        }

        .wa-btn.primary:hover:not(:disabled) {
          background: #00c89a;
          box-shadow: 0 6px 20px rgba(0,168,132,0.45);
          transform: translateY(-1px);
        }

        .wa-btn.primary:active:not(:disabled) { transform: translateY(0); }

        .wa-btn:disabled {
          background: #2a3942;
          color: #4a5568;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Error box */
        .error-box {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 12px;
          padding: 12px 16px;
          color: #f87171;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 18px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        /* Info pill (phone display in step 2) */
        .phone-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #111b21;
          border: 1px solid #2a3942;
          border-radius: 14px;
          padding: 14px 18px;
          margin-bottom: 22px;
        }

        .phone-pill-label { font-size: 11px; color: #8696a0; margin-bottom: 3px; }
        .phone-pill-value { font-size: 15px; font-weight: 600; color: #e9edef; }
        .phone-pill-email { font-size: 12px; color: #8696a0; margin-top: 1px; }

        .change-btn {
          background: none;
          border: none;
          color: #00a884;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          padding: 4px 0;
          flex-shrink: 0;
        }

        .change-btn:hover { color: #00c89a; }

        /* Resend row */
        .resend-row {
          text-align: center;
          margin-top: 18px;
          font-size: 13px;
          color: #8696a0;
        }

        .resend-btn {
          background: none;
          border: none;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
          transition: color 0.2s;
        }

        .resend-btn.active   { color: #00a884; }
        .resend-btn.active:hover { color: #00c89a; }
        .resend-btn.inactive { color: #4a5568; cursor: default; }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0;
        }
        .divider-line { flex: 1; height: 1px; background: #2a3942; }
        .divider-text { font-size: 11px; color: #4a5568; white-space: nowrap; }

        /* Footer */
        .card-footer {
          text-align: center;
          font-size: 11px;
          color: #4a5568;
          margin-top: 22px;
          line-height: 1.6;
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          display: inline-block;
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
        }
        @keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
        /* Hide number input arrows */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div className="login-root">
  <div className="login-card">

    {/* ── HEADER ── */}
    <div className="card-header">
      <div className="wa-icon-wrap">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 2.09.64 4.04 1.74 5.66L2 22l4.34-1.74C7.96 21.36 9.91 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.9)" />
          <path d="M17 14.5c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.57-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.02 1-1.02 2.43 0 1.43 1.05 2.82 1.2 3.02.15.2 2.05 3.12 4.97 4.38.7.3 1.24.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.19-.57-.34z" fill="#00a884" />
        </svg>
      </div>
      <div className="card-title">WhatsApp Business</div>
      <div className="card-subtitle">
        {step === 1 ? "Sign in to your account" : "Check your email for the OTP"}
      </div>
    </div>

    {/* ── BODY ── */}
    <div className="card-body">

      {/* Step indicator */}
      <div className="step-row">
        <div className={`step-dot ${step === 1 ? "active" : "done"}`}>
          {step > 1 ? "✓" : "1"}
        </div>
        <div className={`step-line ${step > 1 ? "done" : "undone"}`} />
        <div className={`step-dot ${step === 2 ? "active" : "inactive"}`}>2</div>
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Phone Number</label>
            <input
              className="wa-input"
              type="tel"
              placeholder="e.g. 919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="field-label">
              Registered Email
              <span style={{ color: "#4a5568", fontSize: 11, fontWeight: 400, marginLeft: 6, textTransform: "none", letterSpacing: 0 }}>
                — OTP will be sent here
              </span>
            </label>
            <input
              className="wa-input"
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div className="error-box">
              <span style={{ fontSize: 15, flexShrink: 0 }}>⚠</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="wa-btn primary"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : "Send OTP →"}
          </button>

          <div className="card-footer">
            🔒 Your data is encrypted end-to-end.<br />
            By continuing, you agree to our Terms & Privacy Policy.
          </div>
        </form>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
          {/* Phone + email pill */}
          <div className="phone-pill">
            <div>
              <div className="phone-pill-label">Sending OTP to</div>
              <div className="phone-pill-value">{phone}</div>
              <div className="phone-pill-email">{email}</div>
            </div>
            <button
              type="button"
              className="change-btn"
              onClick={() => { setStep(1); setError(""); setOtp(""); }}
            >
              Change
            </button>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="field-label">Enter 6-digit OTP</label>
            <input
              className="wa-input otp-input"
              type="number"
              placeholder="——————"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              autoFocus
            />
          </div>

          {error && (
            <div className="error-box">
              <span style={{ fontSize: 15, flexShrink: 0 }}>⚠</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="wa-btn primary"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : "Verify & Sign In →"}
          </button>

          <div className="resend-row">
            Didn't receive it?
            <button
              type="button"
              className={`resend-btn ${resendTimer > 0 ? "inactive" : "active"}`}
              onClick={handleResend}
              disabled={resendTimer > 0 || loading}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
            </button>
          </div>

          <div className="card-footer">
            🔒 Your data is encrypted end-to-end.<br />
            By continuing, you agree to our Terms & Privacy Policy.
          </div>
        </form>
      )}

    </div>
  </div>
</div>
    {/* ── NOT FOUND MODAL ── */}
{showNotFoundModal && (
  <div style={{
    position: "fixed", inset: 0, zIndex: 9999,
    background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20,
    backdropFilter: "blur(4px)",
  }}>
    <div style={{
      background: "#202c33",
      borderRadius: 20,
      padding: "32px 28px",
      maxWidth: 360,
      width: "100%",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
      textAlign: "center",
      animation: "fadeInUp 0.25s ease",
    }}>
      {/* Icon */}
      <div style={{
        width: 64, height: 64,
        background: "rgba(220,38,38,0.15)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
        border: "2px solid rgba(220,38,38,0.3)",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Title */}
      <h2 style={{ color: "#e9edef", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
        Access Denied
      </h2>

      {/* Message */}
      <p style={{ color: "#8696a0", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
        Your phone number or email was not found in our records.<br /><br />
        Please contact your <strong style={{ color: "#e9edef" }}>admin</strong> to get access.
      </p>

      {/* OK Button */}
      <button
        onClick={() => {
          setShowNotFoundModal(false);
          setPhone("");
          setEmail("");
          setError("");
          window.location.reload(); // ✅ refresh after OK
        }}
        style={{
          width: "100%",
          padding: "13px",
          background: "#00a884",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => e.target.style.background = "#00c89a"}
        onMouseLeave={(e) => e.target.style.background = "#00a884"}
      >
        OK, Got it
      </button>
    </div>
  </div>
)}
    </>
  );
}