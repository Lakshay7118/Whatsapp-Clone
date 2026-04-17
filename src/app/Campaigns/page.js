"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Search,
  RefreshCcw,
  Send,
  ChevronRight,
  Megaphone,
  CalendarDays,
  PlayCircle,
  PauseCircle,
  Play,
  Trash2,
} from "lucide-react";
import API from "../utils/api";   // ✅ using your axios instance

// ------------------------------------------------------------
// Styles
// ------------------------------------------------------------
const pageStyles = {
  shell: {
    background:
      "radial-gradient(circle at top left, rgba(15, 95, 100, 0.06), transparent 22%), radial-gradient(circle at top right, rgba(34, 197, 94, 0.05), transparent 20%), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
    minHeight: "calc(100vh - 70px)",
  },
  premiumCard: {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(15,23,42,0.05)",
    boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
    borderRadius: "24px",
  },
  statCard: {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(15,23,42,0.05)",
    boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
    borderRadius: "22px",
    padding: "18px",
    height: "100%",
  },
  statIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(15,95,100,0.12), rgba(34,197,94,0.12))",
    color: "#0f5f64",
    marginBottom: "14px",
  },
  heroChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(15,95,100,0.08)",
    color: "#0f5f64",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "10px",
  },
  heroTitle: {
    fontSize: "28px",
    fontWeight: 800,
    lineHeight: 1.2,
    color: "#0f172a",
    marginBottom: "6px",
  },
  heroSubtitle: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: 1.7,
    margin: 0,
  },
  launchBtn: {
    minWidth: "190px",
    height: "46px",
    border: "none",
    borderRadius: "999px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 700,
    background:
      "linear-gradient(135deg, #0f5f64 0%, #14808a 60%, #22c55e 100%)",
    boxShadow: "0 14px 28px rgba(15,95,100,0.22)",
    cursor: "pointer",
  },
  toolbarCard: {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(15,23,42,0.05)",
    boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
    borderRadius: "22px",
    padding: "16px",
  },
  searchWrap: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
  },
  searchInput: {
    height: "46px",
    borderRadius: "14px",
    border: "1px solid #dbe3eb",
    background: "#ffffff",
    paddingLeft: "42px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#0f172a",
    boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
  },
  refreshBtn: {
    height: "44px",
    padding: "0 16px",
    borderRadius: "999px",
    border: "1px solid #dbe3eb",
    background: "#fff",
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  filterPill: {
    height: "38px",
    padding: "0 16px",
    borderRadius: "999px",
    border: "1px solid #dbe3eb",
    background: "#fff",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  filterPillActive: {
    color: "#fff",
    border: "none",
    background:
      "linear-gradient(135deg, #0f5f64 0%, #14808a 60%, #22c55e 100%)",
    boxShadow: "0 10px 20px rgba(15,95,100,0.16)",
  },
  tableWrap: {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(15,23,42,0.05)",
    boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
    borderRadius: "24px",
    overflow: "hidden",
  },
  tableHeader: {
    background: "linear-gradient(180deg, #fbfdff 0%, #f8fafc 100%)",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "12px",
    fontWeight: 800,
    color: "#64748b",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  row: {
    borderBottom: "1px solid #eef2f7",
    transition: "0.2s ease",
  },
  badgeBase: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "28px",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
    border: "1px solid transparent",
  },
  metricChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    fontSize: "11px",
    fontWeight: 700,
    color: "#475569",
  },
  actionBtn: {
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    padding: "6px",
    cursor: "pointer",
    color: "#64748b",
    transition: "all 0.2s",
  },
};

function getStatusStyle(status) {
  const s = status?.toLowerCase() || "";
  if (s === "running" || s === "active") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#16a34a",
      borderColor: "rgba(34,197,94,0.18)",
    };
  }
  if (s === "scheduled") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#d97706",
      borderColor: "rgba(245,158,11,0.18)",
    };
  }
  if (s === "paused") {
    return {
      background: "rgba(148,163,184,0.14)",
      color: "#64748b",
      borderColor: "rgba(148,163,184,0.18)",
    };
  }
  if (s === "draft") {
    return {
      background: "rgba(148,163,184,0.14)",
      color: "#64748b",
      borderColor: "rgba(148,163,184,0.18)",
    };
  }
  return {
    background: "rgba(15,23,42,0.08)",
    color: "#334155",
    borderColor: "rgba(15,23,42,0.12)",
  };
}

function getTypeStyle(type) {
  if (type === "Broadcast") {
    return {
      background: "rgba(239,68,68,0.1)",
      color: "#dc2626",
      borderColor: "rgba(239,68,68,0.14)",
    };
  }
  if (type === "API") {
    return {
      background: "rgba(59,130,246,0.1)",
      color: "#2563eb",
      borderColor: "rgba(59,130,246,0.14)",
    };
  }
  if (type === "Scheduled") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#d97706",
      borderColor: "rgba(245,158,11,0.16)",
    };
  }
  return {
    background: "rgba(100,116,139,0.1)",
    color: "#475569",
    borderColor: "rgba(100,116,139,0.14)",
  };
}

// ------------------------------------------------------------
// Skeleton Components
// ------------------------------------------------------------
function SkeletonLine({ width = "100%", height = 14, radius = 8 }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, #eef2f7 0%, #f8fafc 50%, #eef2f7 100%)",
        backgroundSize: "200% 100%",
        animation: "pulse 1.2s ease-in-out infinite",
      }}
    />
  );
}

function HeaderSkeleton() {
  return (
    <div style={pageStyles.premiumCard} className="p-3 p-md-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-start align-items-lg-center">
        <div className="w-100">
          <SkeletonLine width={180} height={24} radius={8} />
          <div className="mt-2">
            <SkeletonLine width={260} height={14} radius={6} />
          </div>
        </div>
        <SkeletonLine width={170} height={44} radius={999} />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="row g-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="col-12 col-sm-6 col-xl-3">
          <div style={pageStyles.statCard}>
            <SkeletonLine width={90} height={13} />
            <div className="mt-3">
              <SkeletonLine width={70} height={24} />
            </div>
            <div className="mt-2">
              <SkeletonLine width={120} height={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SearchFilterSkeleton() {
  return (
    <div style={pageStyles.toolbarCard}>
      <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-stretch align-items-lg-center">
        <div
          className="rounded-4"
          style={{
            width: "100%",
            maxWidth: 420,
            height: 46,
            background:
              "linear-gradient(90deg, #eef2f7 0%, #f8fafc 50%, #eef2f7 100%)",
          }}
        />
        <div
          className="rounded-pill"
          style={{
            width: 120,
            height: 44,
            background:
              "linear-gradient(90deg, #eef2f7 0%, #f8fafc 50%, #eef2f7 100%)",
          }}
        />
      </div>

      <div className="d-flex flex-wrap gap-2 mt-3">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-pill"
            style={{
              width: 98,
              height: 38,
              background:
                "linear-gradient(90deg, #eef2f7 0%, #f8fafc 50%, #eef2f7 100%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Stat Card Component
// ------------------------------------------------------------
function StatCard({ icon: Icon, label, value, subtext }) {
  return (
    <div style={pageStyles.statCard}>
      <div style={pageStyles.statIcon}>
        <Icon size={18} />
      </div>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1.2,
          marginTop: "6px",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
        {subtext}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Main Component
// ------------------------------------------------------------
export default function CampaignsPage() {
  const router = useRouter();
  const pageRef = useRef(null);
  const contentRef = useRef(null);
  const rowsRef = useRef([]);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [updatingId, setUpdatingId] = useState(null); // track which campaign is being updated

  const topTabs = ["All", "Broadcast", "API", "Scheduled"];

  // Fetch campaigns from backend using API
  const fetchCampaigns = () => {
    setIsLoading(true);
    API.get("/campaigns")
      .then((res) => {
        const data = res.data;
        if (data.success && Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns);
        } else {
          console.error("Invalid campaigns response", data);
          setCampaigns([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch campaigns", err);
        setCampaigns([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Delete campaign
  const handleDelete = async (campaignId, campaignName) => {
    if (!confirm(`Delete campaign "${campaignName}" permanently?`)) return;
    try {
      await API.delete(`/campaigns/${campaignId}`);
      setCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete campaign");
    }
  };

  // Toggle pause/resume
  const handleToggleStatus = async (campaign) => {
    const newStatus = campaign.status === "paused" ? "scheduled" : "paused";
    setUpdatingId(campaign._id);
    try {
      const res = await API.patch(`/campaigns/${campaign._id}/status`, {
        status: newStatus,
      });
      const data = res.data;
      if (data.success && data.campaign) {
        setCampaigns((prev) =>
          prev.map((c) => (c._id === campaign._id ? data.campaign : c))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating campaign status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to map backend campaign to display format
  const mapCampaign = (camp) => {
    let audience = "Unknown";
    if (camp.audienceType === "tags" && camp.tagIds?.length) {
      audience = `${camp.tagIds.length} tag(s)`;
    } else if (camp.audienceType === "manual" && camp.manualNumbers?.length) {
      audience = `${camp.manualNumbers.length} number(s)`;
    }

    let date = "—";
    if (camp.scheduledDateTime) {
      date = new Date(camp.scheduledDateTime).toLocaleDateString();
    } else if (camp.nextRun) {
      date = new Date(camp.nextRun).toLocaleDateString();
    }

    const status = camp.status
      ? camp.status.charAt(0).toUpperCase() + camp.status.slice(1)
      : "Draft";
    const type =
      camp.messageType === "Pre-approved template message"
        ? "Broadcast"
        : camp.messageType || "Unknown";

    return {
      id: camp._id,
      name: camp.campaignName,
      type,
      status,
      audience,
      sent: camp.sentCount || 0,
      delivered: 0,
      opened: 0,
      replied: 0,
      date,
      raw: camp,
    };
  };

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns
      .map(mapCampaign)
      .filter((item) => {
        const matchSearch =
          item.name.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.audience.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q);
        const matchFilter =
          activeFilter === "All"
            ? true
            : item.type.toLowerCase() === activeFilter.toLowerCase();
        return matchSearch && matchFilter;
      });
  }, [campaigns, search, activeFilter]);

  const stats = useMemo(() => {
    const total = campaigns.length;
    const running = campaigns.filter(
      (c) => c.status === "active" || c.status === "running"
    ).length;
    const scheduled = campaigns.filter((c) => c.status === "scheduled").length;
    const totalSent = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
    return { total, running, scheduled, totalSent };
  }, [campaigns]);

  const handleRefresh = () => {
    fetchCampaigns();
  };

  // Animations
  useEffect(() => {
    if (isLoading || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 18, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out",
        }
      );

      const validRows = rowsRef.current.filter(Boolean);
      if (validRows.length) {
        gsap.fromTo(
          validRows,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.42,
            delay: 0.12,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [isLoading, filteredData]);

  rowsRef.current = [];

  return (
    <div
      ref={pageRef}
      className="container-fluid py-3 py-md-4"
      style={pageStyles.shell}
    >
      <div className="d-flex flex-column gap-3 gap-md-4 h-100">
        {isLoading ? (
          <>
            <HeaderSkeleton />
            <StatsSkeleton />
            <SearchFilterSkeleton />
          </>
        ) : (
          <div
            ref={contentRef}
            className="d-flex flex-column gap-3 gap-md-4 h-100"
          >
            {/* Header with stats */}
            <div style={pageStyles.premiumCard} className="p-3 p-md-4">
              <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-start align-items-lg-center">
                <div>
                  <div style={pageStyles.heroChip}>
                    <Megaphone size={14} />
                    CAMPAIGNS
                  </div>
                  <div style={pageStyles.heroTitle}>
                    Broadcast & Automation
                  </div>
                  <div style={pageStyles.heroSubtitle}>
                    Manage all your WhatsApp campaigns from one dashboard.
                  </div>
                </div>
                <button
                  style={pageStyles.launchBtn}
                  className="btn d-inline-flex align-items-center justify-content-center gap-2"
                  onClick={() => router.push("/Campaigns/launch")}
                  type="button"
                >
                  <Send size={16} />
                  Launch Campaign
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon={Megaphone}
                  label="Total Campaigns"
                  value={stats.total}
                  subtext="All campaigns"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon={PlayCircle}
                  label="Running"
                  value={stats.running}
                  subtext="Active now"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon={CalendarDays}
                  label="Scheduled"
                  value={stats.scheduled}
                  subtext="Upcoming"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  icon={Send}
                  label="Total Sent"
                  value={stats.totalSent}
                  subtext="Messages delivered"
                />
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div style={pageStyles.toolbarCard}>
              <div className="d-flex flex-column flex-xl-row gap-3 justify-content-between align-items-stretch align-items-xl-center">
                <div style={pageStyles.searchWrap}>
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: 14,
                      transform: "translateY(-50%)",
                      color: "#64748b",
                      zIndex: 2,
                    }}
                  />
                  <input
                    className="form-control"
                    style={pageStyles.searchInput}
                    placeholder="Search campaign, type, audience or status"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button
                    className="btn d-inline-flex align-items-center justify-content-center gap-2"
                    style={pageStyles.refreshBtn}
                    onClick={handleRefresh}
                    type="button"
                  >
                    <RefreshCcw size={16} />
                    Refresh
                  </button>

                  <button
                    style={pageStyles.launchBtn}
                    className="btn d-inline-flex align-items-center justify-content-center gap-2"
                    onClick={() => router.push("/Campaigns/launch")}
                    type="button"
                  >
                    <Send size={16} />
                    Launch Campaign
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
                {topTabs.map((tab) => (
                  <button
                    key={tab}
                    className="btn"
                    type="button"
                    style={{
                      ...pageStyles.filterPill,
                      ...(activeFilter === tab ? pageStyles.filterPillActive : {}),
                    }}
                    onClick={() => setActiveFilter(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaigns Table */}
            <div style={pageStyles.tableWrap}>
              <div className="d-none d-md-block px-3" style={pageStyles.tableHeader}>
                <div className="row m-0 align-items-center">
                  <div className="col-md-3 py-3">Campaign</div>
                  <div className="col-md-2 py-3">Type</div>
                  <div className="col-md-2 py-3">Date</div>
                  <div className="col-md-2 py-3">Status</div>
                  <div className="col-md-2 py-3">Audience</div>
                  <div className="col-md-1 py-3">Actions</div>
                </div>
              </div>

              <div style={{ maxHeight: "60vh", overflowY: "auto", overflowX: "hidden" }}>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    const isUpdating = updatingId === item.id;
                    const isPaused = item.raw.status === "paused";

                    return (
                      <div
                        key={item.id}
                        ref={(el) => {
                          rowsRef.current[index] = el;
                        }}
                        className="px-3 py-3"
                        style={pageStyles.row}
                      >
                        {/* Mobile view */}
                        <div className="d-block d-md-none">
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "#0f172a",
                              marginBottom: "4px",
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              marginBottom: "8px",
                            }}
                          >
                            Sent {item.sent} • Delivered {item.delivered}
                          </div>
                          <div className="d-flex flex-wrap gap-2 mb-2">
                            <span
                              style={{
                                ...pageStyles.badgeBase,
                                ...getTypeStyle(item.type),
                              }}
                            >
                              {item.type}
                            </span>
                            <span
                              style={{
                                ...pageStyles.badgeBase,
                                ...getStatusStyle(item.status),
                              }}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="small text-secondary mb-2">
                            <strong>Date:</strong> {item.date}
                          </div>
                          <div className="small text-secondary mb-2">
                            <strong>Audience:</strong> {item.audience}
                          </div>
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            <span style={pageStyles.metricChip}>
                              Opened {item.opened}
                            </span>
                            <span style={pageStyles.metricChip}>
                              Replies {item.replied}
                            </span>
                          </div>
                          {/* Mobile Actions */}
                          <div className="d-flex gap-2 mt-2">
                            <button
                              onClick={() => handleToggleStatus(item.raw)}
                              disabled={isUpdating}
                              style={{
                                ...pageStyles.actionBtn,
                                color: isPaused ? "#16a34a" : "#f59e0b",
                                opacity: isUpdating ? 0.5 : 1,
                              }}
                              title={isPaused ? "Resume" : "Pause"}
                            >
                              {isPaused ? <Play size={16} /> : <PauseCircle size={16} />}
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              style={{ ...pageStyles.actionBtn, color: "#dc2626" }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Desktop view */}
                        <div className="row align-items-center d-none d-md-flex">
                          <div className="col-md-3">
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "#0f172a",
                                marginBottom: "4px",
                              }}
                            >
                              {item.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                              Sent {item.sent} • Delivered {item.delivered} • Opened {item.opened}
                            </div>
                          </div>
                          <div className="col-md-2">
                            <span
                              style={{
                                ...pageStyles.badgeBase,
                                ...getTypeStyle(item.type),
                              }}
                            >
                              {item.type}
                            </span>
                          </div>
                          <div className="col-md-2">
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#334155",
                              }}
                            >
                              {item.date}
                            </div>
                          </div>
                          <div className="col-md-2">
                            <span
                              style={{
                                ...pageStyles.badgeBase,
                                ...getStatusStyle(item.status),
                              }}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="col-md-2">
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#334155",
                              }}
                            >
                              {item.audience}
                            </div>
                          </div>
                          <div className="col-md-1">
                            <div className="d-flex gap-1">
                              <button
                                onClick={() => handleToggleStatus(item.raw)}
                                disabled={isUpdating}
                                style={{
                                  ...pageStyles.actionBtn,
                                  color: isPaused ? "#16a34a" : "#f59e0b",
                                  opacity: isUpdating ? 0.5 : 1,
                                }}
                                title={isPaused ? "Resume" : "Pause"}
                              >
                                {isPaused ? <Play size={16} /> : <PauseCircle size={16} />}
                              </button>
                              <button
                                onClick={() => handleDelete(item.id, item.name)}
                                style={{ ...pageStyles.actionBtn, color: "#dc2626" }}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "48px 20px",
                      textAlign: "center",
                      color: "#64748b",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    No campaigns found.
                  </div>
                )}
              </div>
            </div>

            <style jsx global>{`
              @keyframes pulse {
                0% {
                  background-position: 200% 0;
                }
                100% {
                  background-position: -200% 0;
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}