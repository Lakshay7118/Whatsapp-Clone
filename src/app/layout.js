"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./componets/sidebar";
import Topbar from "./componets/Topbar";
import BottomTabs from "./componets/BottomTabs";
import "bootstrap/dist/css/bootstrap.min.css";

// ---------- helpers (same as your Task page) ----------
const PALETTE = [
  "#6366f1","#f43f5e","#f59e0b","#10b981","#3b82f6",
  "#8b5cf6","#ec4899","#06b6d4"
];
const userColor   = (id = "") =>
  PALETTE[parseInt(("0000" + id).slice(-4), 16) % PALETTE.length];
const userInitial = (name = "") => (name || "?").trim().charAt(0).toUpperCase();
const enrichUser  = (u) => {
  if (!u) return null;
  const id = u._id?.toString?.() || u.id || "";
  return {
    ...u,
    id,
    initial: userInitial(u.name),
    color: userColor(id),
  };
};

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);   // <-- ✨ NEW

  const pathname = usePathname();
  const router = useRouter();

  // ---------- Login check and user extraction ----------
  const checkLoginStatus = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      if (pathname !== "/") router.push("/");
    } else {
      try {
        const parsed = JSON.parse(user);
        setCurrentUser(enrichUser(parsed));   // <-- enrich with colour & initial
      } catch {
        setCurrentUser({ name: "User", initial: "?", color: "#6b7280" });
      }
      setIsLoggedIn(true);
    }
  };

  useEffect(() => { checkLoginStatus(); }, [pathname]);

  useEffect(() => {
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStatusChanged", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const user = localStorage.getItem("user");
      if (!user) {
        setIsLoggedIn(false);
        setCurrentUser(null);
        if (pathname !== "/") router.push("/");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  // ---------- mobile / chat listeners ----------
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 820);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onOpen  = () => setChatOpen(true);
    const onClose = () => setChatOpen(false);
    window.addEventListener("detailViewOpen",  onOpen);
    window.addEventListener("detailViewClose", onClose);
    return () => {
      window.removeEventListener("detailViewOpen",  onOpen);
      window.removeEventListener("detailViewClose", onClose);
    };
  }, []);

  useEffect(() => {
    const segment = pathname?.split("/")[1] || "dashboard";
    setActiveTab(segment);
  }, [pathname]);

  const hideTopbar = isMobile && chatOpen;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    router.push("/");
    window.dispatchEvent(new Event("loginStatusChanged"));
  };

  const titleMap = {
    dashboard:     "Dashboard",
    "live-chat":   "Live Chat",
    history:       "History",
    contacts:      "Contacts",
    campaigns:     "Campaigns",
    "ads-manager": "Ads Manager",
    flows:         "Flows",
    manage:        "Manage",
    developer:     "Developer",
    "all-projects":"All Projects",
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
            overflowY: "auto",
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
          overflowY: "auto",
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .main-content {
              margin-left: 108px !important;
            }
          }
        `}</style>

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
            padding: "14px 10px 0px 10px",
            paddingBottom: isMobile ? "74px" : "14px",
            boxSizing: "border-box",
          }}
        >
          {/* ✨ Pass the real user object instead of hardcoded "Nishant" */}
          <Topbar
            hidden={hideTopbar}
            title={titleMap[activeTab] || "Dashboard"}
            user={currentUser}                     // <-- NEW
            onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
            onLogout={handleLogout}
          />

          <div
            style={{
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

        <BottomTabs />
      </body>
    </html>
  );
}