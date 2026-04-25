"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./componets/sidebar";
import Topbar from "./componets/Topbar";
import BottomTabs from "./componets/BottomTabs"; // ✅ ADD THIS
import "bootstrap/dist/css/bootstrap.min.css";

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const checkLoginStatus = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setIsLoggedIn(false);
      if (pathname !== "/") router.push("/");
    } else {
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
        if (pathname !== "/") router.push("/");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pathname]);

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

  // ✅ Sync activeTab with current route
  useEffect(() => {
    const segment = pathname?.split("/")[1] || "dashboard";
    setActiveTab(segment);
  }, [pathname]);

  const hideTopbar = isMobile && chatOpen;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
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
        <body style={{
          margin: 0,
          background: "#eef3f7",
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          overflowY: "auto",
        }}>
          {children}
        </body>
      </html>
    );
  }

  // 🟢 LOGGED IN
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        background: "#eef3f7",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflowY: "auto",
      }}>
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
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 998 }}
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
            paddingBottom: isMobile ? "74px" : "14px", // ✅ ADD THIS
            boxSizing: "border-box",
           
          }}
        >
          <Topbar
            hidden={hideTopbar}
            title={titleMap[activeTab] || "Dashboard"}
            userName="Nishant"
            onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
            onLogout={handleLogout}
          />

          <div style={{
            background: "#ffffff",
            border: "1px solid #dbe4ea",
            borderRadius: "20px",
            padding: "18px",
            boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
          }}>
            {children}
          </div>
        </main>

        <BottomTabs /> {/* ✅ ADD THIS */}

      </body>
    </html>
  );
}