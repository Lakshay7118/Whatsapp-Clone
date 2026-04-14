"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Menu, Search, LogOut, Bell } from "lucide-react";

export default function Topbar({
  userName = "Nishant",
  onMenuClick,
  onLogout,
  title = "Dashboard",
}) {
  const topbarRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const avatarInitial = userName?.charAt(0)?.toUpperCase() || "N";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        topbarRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else alert("Logout clicked");
  };

  return (
    <header
      ref={topbarRef}
      style={{ width: "100%", marginBottom: "14px", boxSizing: "border-box" }}
    >
      {/* ===== MOBILE ===== */}
      <div
        className="flex md:hidden items-center gap-2"
        style={{ width: "100%" }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "#fff", border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <Menu size={18} color="#374151" />
        </motion.button>

        <div
          style={{
            flex: 1, display: "flex", alignItems: "center",
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: "12px", padding: "0 12px", height: "40px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", gap: "8px",
          }}
        >
          <Search size={15} color="#9ca3af" />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            style={{
              flex: 1, border: "none", outline: "none",
              fontSize: "13px", background: "transparent", color: "#374151",
            }}
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "#0b535d", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: "15px", border: "none",
            cursor: "pointer", flexShrink: 0,
            boxShadow: "0 4px 12px rgba(11,83,93,0.35)",
          }}
        >
          {avatarInitial}
        </motion.button>
      </div>

      {/* ===== DESKTOP ===== */}
      <div
        className="hidden md:flex items-center gap-3"
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          padding: "10px 16px",
          boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Hamburger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onMenuClick}
          style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#f1f5f9", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <Menu size={17} color="#374151" />
        </motion.button>

        {/* Title */}
        <span
          style={{
            fontSize: "15px", fontWeight: 700, color: "#111827",
            flexShrink: 0,
          }}
        >
          {title}
        </span>

        {/* Divider */}
        <div
          style={{
            width: "1px", height: "22px",
            background: "#e2e8f0", flexShrink: 0,
          }}
        />

        {/* Search */}
        <div
          style={{
            display: "flex", alignItems: "center",
            background: "#f8fafc", border: "1px solid #e9eef3",
            borderRadius: "12px", padding: "0 14px", height: "36px",
            gap: "8px", width: "280px", flexShrink: 0,
          }}
        >
          <Search size={14} color="#9ca3af" />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search chats..."
            style={{
              flex: 1, border: "none", outline: "none",
              fontSize: "13px", background: "transparent", color: "#374151",
            }}
          />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#f1f5f9", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative", flexShrink: 0,
          }}
        >
          <Bell size={16} color="#374151" />
          <span
            style={{
              position: "absolute", top: "7px", right: "7px",
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#ef4444", border: "2px solid #fff",
            }}
          />
        </motion.button>

        {/* User chip */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#f1f5f9", borderRadius: "12px",
            padding: "4px 12px 4px 4px", flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "#0b535d", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "12px",
            }}
          >
            {avatarInitial}
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>
            {userName}
          </span>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleLogout}
          style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#fff0f0", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <LogOut size={16} color="#ef4444" />
        </motion.button>
      </div>
    </header>
  );
}
