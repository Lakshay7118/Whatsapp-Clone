"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./componets/sidebar";
import Topbar from "./componets/Topbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Function to check login status
  const checkLoginStatus = () => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  };

  // Check on mount and when pathname changes
  useEffect(() => {
    checkLoginStatus();
  }, [pathname]);

  // Listen for storage events
  useEffect(() => {
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStatusChanged", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    checkLoginStatus();
    window.dispatchEvent(new Event("loginStatusChanged"));
  };

  const titleMap = {
    dashboard: "Dashboard",
    "live-chat": "Live Chat",
    history: "History",
    contacts: "Contacts",
    campaigns: "Campaigns",
    "ads-manager": "Ads Manager",
    flows: "Flows",
    manage: "Manage",
    developer: "Developer",
    "all-projects": "All Projects",
  };

  // 🔴 NOT LOGGED IN
  if (!isLoggedIn) {
    return (
      <html lang="en">
        <body
          style={{
            margin: 0,
            background: "#eef3f7",
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            overflowY: "auto", // ✅ FIX
          }}
        >
          {children}
        </body>
      </html>
    );
  }

  // 🟢 LOGGED IN
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#eef3f7",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          overflowY: "auto", // ✅ FIX
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .main-content {
              margin-left: 108px !important;
            }
          }
        `}</style>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 998,
            }}
            className="md:hidden"
          />
        )}

        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main
          className="main-content"
          style={{
            marginLeft: 0,
            minHeight: "100vh",
            padding: "14px",
            boxSizing: "border-box",
            overflowY: "auto", // ✅ FIX
          }}
        >
          <Topbar
            title={titleMap[activeTab] || "Dashboard"}
            userName="Nishant"
            onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
            onLogout={handleLogout}
          />

          <div
            style={{
              minHeight: "auto", // ✅ FIX (removed calc issue)
              background: "#ffffff",
              border: "1px solid #dbe4ea",
              borderRadius: "20px",
              padding: "18px",
              boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
            }}
          >
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
