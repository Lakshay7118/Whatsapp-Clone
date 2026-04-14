"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  User,
  Lock,
  Bell,
  Shield,
  Palette,
  MessageCircle,
  Database,
  Users,
  Search,
  Save,
  RotateCcw,
  MoreVertical,
  Settings,
  ArrowLeft,
} from "lucide-react";

const settingsMenu = [
  {
    id: "profile",
    title: "Profile",
    subtitle: "Name, photo and business details",
    icon: User,
  },
  {
    id: "account",
    title: "Account",
    subtitle: "Security and login settings",
    icon: Lock,
  },
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Message and alert preferences",
    icon: Bell,
  },
  {
    id: "privacy",
    title: "Privacy",
    subtitle: "Visibility and permissions",
    icon: Shield,
  },
  {
    id: "appearance",
    title: "Appearance",
    subtitle: "Theme and interface settings",
    icon: Palette,
  },
  {
    id: "chat",
    title: "Chat Settings",
    subtitle: "Default chat behaviour",
    icon: MessageCircle,
  },
  {
    id: "storage",
    title: "Storage & Data",
    subtitle: "Media quality and data usage",
    icon: Database,
  },
  {
    id: "team",
    title: "Team Access",
    subtitle: "Roles and permissions",
    icon: Users,
  },
];

export default function SettingsPage() {
  const pageRef = useRef(null);
  const leftHeaderRef = useRef(null);
  const listRef = useRef(null);
  const rowsRef = useRef([]);

  const [search, setSearch] = useState("");
  const [selectedSetting, setSelectedSetting] = useState(settingsMenu[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const [form, setForm] = useState({
    businessName: "Vaishnav WhatsApp CRM",
    ownerName: "Kapil Vaishnav",
    phone: "+91 9876501234",
    email: "kapil@example.com",
    twoFactor: true,
    loginAlerts: true,
    desktopNotifications: true,
    soundAlerts: false,
    readReceipts: true,
    lastSeenVisibility: "Everyone",
    theme: "Light",
    compactMode: false,
    enterToSend: true,
    mediaAutoDownload: false,
    highQualityUploads: true,
    teamAccess: "Main Owner",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredMenu = useMemo(() => {
    const q = search.toLowerCase().trim();
    return settingsMenu.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    );
  }, [search]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftHeaderRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }
      );

      gsap.fromTo(
        listRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          delay: 0.12,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        rowsRef.current,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.24,
          delay: 0.16,
          ease: "power2.out",
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [search, mobileDetailsOpen]);

  useEffect(() => {
    if (!selectedSetting && filteredMenu.length > 0) {
      setSelectedSetting(filteredMenu[0]);
    }
  }, [filteredMenu, selectedSetting]);

  const stats = {
    totalSettings: settingsMenu.length,
    notificationsOn:
      Number(form.desktopNotifications) +
      Number(form.loginAlerts) +
      Number(form.soundAlerts),
    privacyEnabled:
      Number(form.readReceipts) + Number(form.twoFactor),
  };

  const handleInput = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <style jsx global>{`
        html,
        body {
          height: 100%;
          overflow: hidden;
        }

        .sticky-settings-shell {
          position: fixed;
          top: 70px;
          left: 88px;
          right: 0;
          bottom: 0;
          overflow: hidden;
          background: #efeae2;
        }

        .scroll-hidden {
          overflow-y: auto;
          overflow-x: hidden;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scroll-hidden::-webkit-scrollbar {
          display: none;
        }

        .settings-row {
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .settings-row:hover {
          background: #f8f9fa !important;
        }

        .settings-row:hover .settings-icon-wrap {
          transform: scale(1.06);
        }

        .soft-pattern {
          background-image: radial-gradient(
            rgba(7, 94, 84, 0.06) 1px,
            transparent 1px
          );
          background-size: 18px 18px;
        }

        .form-check-input:checked {
          background-color: #198754;
          border-color: #198754;
        }

        .settings-icon-wrap {
          transition: all 0.2s ease;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 991px) {
          .sticky-settings-shell {
            top: 60px;
            left: 0;
          }
        }
      `}</style>

      <div ref={pageRef} className="sticky-settings-shell p-3">
        <div className="h-100 d-flex">
          {(!isMobile || !mobileDetailsOpen) && (
            <div
              className="d-flex flex-column bg-white border-end"
              style={{
                width: isMobile ? "100%" : "400px",
                minWidth: isMobile ? "100%" : "400px",
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <div
                ref={leftHeaderRef}
                className="px-3 py-3 border-bottom flex-shrink-0"
                style={{ backgroundColor: "#f0f2f5" }}
              >
                <div className="position-relative">
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#667781",
                      zIndex: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Search size={18} strokeWidth={2} />
                  </span>

                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search settings"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      paddingLeft: "42px",
                      height: "46px",
                    }}
                  />
                </div>
              </div>

              <div
                ref={listRef}
                className="flex-grow-1 scroll-hidden bg-white"
                style={{ minHeight: 0 }}
              >
                {filteredMenu.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = selectedSetting?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      ref={(el) => (rowsRef.current[index] = el)}
                      className="settings-row px-3 py-3 border-bottom"
                      style={{
                        cursor: "pointer",
                        backgroundColor: isActive ? "#f0fdf4" : "#fff",
                      }}
                      onClick={() => {
                        setSelectedSetting(item);
                        if (isMobile) setMobileDetailsOpen(true);
                      }}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className="settings-icon-wrap rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: isActive ? "#25d366" : "#e9edef",
                            color: isActive ? "#ffffff" : "#54656f",
                          }}
                        >
                          <Icon size={20} strokeWidth={1.9} />
                        </div>

                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-semibold text-dark text-truncate">
                            {item.title}
                          </div>
                          <div
                            className="small text-truncate mt-1"
                            style={{ color: "#667781" }}
                          >
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredMenu.length === 0 && (
                  <div className="px-4 py-5 text-center">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-3" style={{ width: 64, height: 64 }}>
                      <Settings size={28} color="#667781" />
                    </div>
                    <h6 className="fw-bold mt-1 mb-1">No settings found</h6>
                    <p className="text-secondary mb-0">Try another search</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(!isMobile || mobileDetailsOpen) && (
            <div
              className="d-flex flex-column"
              style={{
                flex: 1,
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              <div
                className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between flex-shrink-0"
                style={{ backgroundColor: "#f0f2f5" }}
              >
                <div className="d-flex align-items-center gap-3">
                  {isMobile && (
                    <button
                      type="button"
                      className="btn btn-light action-btn"
                      onClick={() => setMobileDetailsOpen(false)}
                    >
                      <ArrowLeft size={18} />
                    </button>
                  )}

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "44px",
                      height: "44px",
                      backgroundColor: "#d9fdd3",
                      color: "#075e54",
                    }}
                  >
                    {selectedSetting?.icon ? (
                      <selectedSetting.icon size={20} strokeWidth={2} />
                    ) : (
                      <Settings size={20} strokeWidth={2} />
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <div className="fw-semibold text-truncate">
                      {selectedSetting?.title || "Setting Details"}
                    </div>
                    <small style={{ color: "#667781" }}>
                      {selectedSetting?.subtitle ||
                        "WhatsApp style settings panel"}
                    </small>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-light action-btn"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-light action-btn"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-light action-btn"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div
                className="flex-grow-1 scroll-hidden soft-pattern p-4"
                style={{ minHeight: 0 }}
              >
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div
                      className="card border-0 shadow-sm"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body">
                        <div className="small text-secondary mb-2">
                          Total Sections
                        </div>
                        <h5 className="fw-bold mb-1">{stats.totalSettings}</h5>
                        <div className="text-secondary small">
                          Available settings modules
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div
                      className="card border-0 shadow-sm"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body">
                        <div className="small text-secondary mb-2">
                          Alerts Enabled
                        </div>
                        <h5 className="fw-bold mb-1">
                          {stats.notificationsOn}
                        </h5>
                        <div className="text-secondary small">
                          Notification options active
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div
                      className="card border-0 shadow-sm"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body">
                        <div className="small text-secondary mb-2">
                          Privacy Enabled
                        </div>
                        <h5 className="fw-bold mb-1">
                          {stats.privacyEnabled}
                        </h5>
                        <div className="text-secondary small">
                          Protection options active
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div
                      className="card border-0 shadow-sm"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                          <h6 className="fw-bold mb-0">Business Profile</h6>
                          <div className="small text-secondary">
                            Main account information
                          </div>
                        </div>

                        <div className="row g-3">
                          <div className="col-12 col-md-6">
                            <label className="form-label small text-secondary">
                              Business Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={form.businessName}
                              onChange={(e) =>
                                handleInput("businessName", e.target.value)
                              }
                            />
                          </div>

                          <div className="col-12 col-md-6">
                            <label className="form-label small text-secondary">
                              Owner Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={form.ownerName}
                              onChange={(e) =>
                                handleInput("ownerName", e.target.value)
                              }
                            />
                          </div>

                          <div className="col-12 col-md-6">
                            <label className="form-label small text-secondary">
                              Phone
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={form.phone}
                              onChange={(e) =>
                                handleInput("phone", e.target.value)
                              }
                            />
                          </div>

                          <div className="col-12 col-md-6">
                            <label className="form-label small text-secondary">
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              value={form.email}
                              onChange={(e) =>
                                handleInput("email", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Security & Privacy</h6>

                        <div className="d-grid gap-3">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.twoFactor}
                              onChange={(e) =>
                                handleInput("twoFactor", e.target.checked)
                              }
                            />
                            <label className="form-check-label">
                              Two-factor authentication
                            </label>
                          </div>

                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.readReceipts}
                              onChange={(e) =>
                                handleInput("readReceipts", e.target.checked)
                              }
                            />
                            <label className="form-check-label">
                              Read receipts
                            </label>
                          </div>

                          <div>
                            <label className="form-label small text-secondary">
                              Last Seen Visibility
                            </label>
                            <select
                              className="form-select"
                              value={form.lastSeenVisibility}
                              onChange={(e) =>
                                handleInput(
                                  "lastSeenVisibility",
                                  e.target.value
                                )
                              }
                            >
                              <option>Everyone</option>
                              <option>My Contacts</option>
                              <option>Nobody</option>
                            </select>
                          </div>

                          <div>
                            <label className="form-label small text-secondary">
                              Team Access
                            </label>
                            <select
                              className="form-select"
                              value={form.teamAccess}
                              onChange={(e) =>
                                handleInput("teamAccess", e.target.value)
                              }
                            >
                              <option>Main Owner</option>
                              <option>Admin</option>
                              <option>Manager</option>
                              <option>Developer</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Notifications & Chat</h6>

                        <div className="d-grid gap-3">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.desktopNotifications}
                              onChange={(e) =>
                                handleInput(
                                  "desktopNotifications",
                                  e.target.checked
                                )
                              }
                            />
                            <label className="form-check-label">
                              Desktop notifications
                            </label>
                          </div>

                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.loginAlerts}
                              onChange={(e) =>
                                handleInput("loginAlerts", e.target.checked)
                              }
                            />
                            <label className="form-check-label">
                              Login alerts
                            </label>
                          </div>

                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.soundAlerts}
                              onChange={(e) =>
                                handleInput("soundAlerts", e.target.checked)
                              }
                            />
                            <label className="form-check-label">
                              Sound alerts
                            </label>
                          </div>

                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.enterToSend}
                              onChange={(e) =>
                                handleInput("enterToSend", e.target.checked)
                              }
                            />
                            <label className="form-check-label">
                              Press Enter to send
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Appearance</h6>

                        <div className="d-grid gap-3">
                          <div>
                            <label className="form-label small text-secondary">
                              Theme
                            </label>
                            <select
                              className="form-select"
                              value={form.theme}
                              onChange={(e) =>
                                handleInput("theme", e.target.value)
                              }
                            >
                              <option>Light</option>
                              <option>Dark</option>
                              <option>System Default</option>
                            </select>
                          </div>

                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.compactMode}
                              onChange={(e) =>
                                handleInput("compactMode", e.target.checked)
                              }
                            />
                            <label className="form-check-label">
                              Compact mode
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Storage & Media</h6>

                        <div className="d-grid gap-3">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.mediaAutoDownload}
                              onChange={(e) =>
                                handleInput(
                                  "mediaAutoDownload",
                                  e.target.checked
                                )
                              }
                            />
                            <label className="form-check-label">
                              Auto download media
                            </label>
                          </div>

                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={form.highQualityUploads}
                              onChange={(e) =>
                                handleInput(
                                  "highQualityUploads",
                                  e.target.checked
                                )
                              }
                            />
                            <label className="form-check-label">
                              High quality uploads
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div
                      className="card border-0 shadow-sm"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">About this UI</h6>
                        <ul className="text-secondary mb-0 ps-3">
                          <li>left settings menu scrolls separately</li>
                          <li>right detail area scrolls separately</li>
                          <li>outer page remains fixed</li>
                          <li>scrollbars stay hidden</li>
                          <li>mobile opens settings details separately</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="px-3 py-3 border-top d-flex flex-wrap gap-2 flex-shrink-0"
                style={{ backgroundColor: "#f0f2f5" }}
              >
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3"
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success rounded-pill px-3"
                >
                  Preview
                </button>
                <button
                  type="button"
                  className="btn btn-success rounded-pill px-4"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

