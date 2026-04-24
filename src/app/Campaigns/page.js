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
  Bell,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  X,
  Save,
} from "lucide-react";
import API from "../utils/api";

/* ---------- shared styles ---------- */
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
    width: "100%",
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
  approvalBadge: {
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: 700,
  },
  rejectedBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: 700,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(15,23,42,0.55)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    background: "#fff",
    borderRadius: 24,
    width: 700,
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: 24,
    boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },
  closeBtn: {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    width: 36,
    height: 36,
    background: "#f8fafc",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formControl: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #dbe5ee",
    fontSize: 14,
  },
  warningBox: {
    background: "#fef3c7",
    border: "1px solid #fcd34d",
    borderRadius: 8,
    padding: "10px 14px",
    marginBottom: 16,
    fontSize: 13,
    color: "#92400e",
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 6,
    display: "block",
  },
  textarea: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #dbe5ee",
    fontSize: 14,
    resize: "vertical",
  },
  checkboxGroup: {
    maxHeight: 150,
    overflowY: "auto",
    border: "1px solid #dbe5ee",
    borderRadius: 12,
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
};

/* ---------- helpers ---------- */
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

/* ---------- Skeleton components ---------- */
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
    <div className="row g-2 g-md-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="col-6 col-xl-3">
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

/* ---------- Stat Card ---------- */
function StatCard({ icon: Icon, label, value, subtext }) {
  return (
    <div style={pageStyles.statCard} className="stat-card-mobile">
      <div style={pageStyles.statIcon} className="stat-icon-mobile">
        <Icon size={18} />
      </div>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }} className="stat-label-mobile">
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
        className="stat-value-mobile"
      >
        {value}
      </div>
      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }} className="stat-subtext-mobile">
        {subtext}
      </div>
    </div>
  );
}

/* ---------- Pending Approvals Panel ---------- */
function PendingApprovalsPanel({ onApprove, onReject }) {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/campaigns/pending")
      .then((res) => setPending(res.data.campaigns || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/campaigns/${id}/approve`);
      setPending((prev) => prev.filter((c) => c._id !== id));
      onApprove(id);
      alert("✅ Campaign approved!");
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/campaigns/${id}/reject`);
      setPending((prev) => prev.filter((c) => c._id !== id));
      onReject(id);
      alert("❌ Campaign rejected.");
    } catch (err) {
      alert("Failed to reject");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        Loading pending approvals...
      </div>
    );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f1f5f9",
          fontWeight: 800,
          fontSize: 15,
          color: "#0f172a",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Bell size={18} color="#f59e0b" />
        Pending Campaign Approvals
        <span
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {pending.length}
        </span>
      </div>

      {pending.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            color: "#9ca3af",
            fontSize: 14,
          }}
        >
          🎉 No pending approvals
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
          >
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {[
                  "Campaign Name",
                  "Type",
                  "Submitted By",
                  "Role",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#0d9488",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pending.map((c) => (
                <tr key={c._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td
                    style={{ padding: "12px 16px", color: "#374151", fontSize: 14 }}
                  >
                    {c.campaignName}
                  </td>
                  <td
                    style={{ padding: "12px 16px", color: "#374151", fontSize: 14 }}
                  >
                    {c.messageType}
                  </td>
                  <td
                    style={{ padding: "12px 16px", color: "#374151", fontSize: 14 }}
                  >
                    {c.createdBy?.name || "—"}
                  </td>
                  <td
                    style={{ padding: "12px 16px", color: "#374151", fontSize: 14 }}
                  >
                    <span
                      style={{
                        background: "#e0f2fe",
                        color: "#0369a1",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {c.createdBy?.role}
                    </span>
                  </td>
                  <td
                    style={{ padding: "12px 16px", color: "#374151", fontSize: 14 }}
                  >
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td
                    style={{ padding: "12px 16px", color: "#374151", fontSize: 14 }}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleApprove(c._id)}
                        style={{
                          background: "#d1fae5",
                          color: "#065f46",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 14px",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(c._id)}
                        style={{
                          background: "#fee2e2",
                          color: "#991b1b",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 14px",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Edit Campaign Modal ---------- */
function EditCampaignModal({ campaignId, onClose, onUpdate, isSuperAdmin }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    campaignName: "",
    messageType: "Pre-approved template message",
    audienceType: "tags",
    tagIds: [],
    contactIds: [],
    groupIds: [],
    manualNumbers: "",
    templateId: "",
    scheduledDateTime: "",
    recurrence: { type: "one-time" },
    messagePreview: "",
  });

  const [templates, setTemplates] = useState([]);
  const [tags, setTags] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!campaignId) return;
    const fetchData = async () => {
      try {
        const [campaignRes, templatesRes, tagsRes, contactsRes, groupsRes] =
          await Promise.all([
            API.get(`/campaigns/${campaignId}`),
            API.get("/templates"),
            API.get("/tags"),
            API.get("/contacts"),
            API.get("/groups"),
          ]);

        if (campaignRes.data.success) {
          const c = campaignRes.data.campaign;
          setForm({
            campaignName: c.campaignName || "",
            messageType: c.messageType || "Pre-approved template message",
            audienceType: c.audienceType || "tags",
            tagIds: c.tagIds || [],
            contactIds: c.contactIds || [],
            groupIds: c.groupIds || [],
            manualNumbers: (c.manualNumbers || []).join("\n"),
            templateId: c.templateId || "",
            scheduledDateTime: c.scheduledDateTime
              ? new Date(c.scheduledDateTime).toISOString().slice(0, 16)
              : "",
            recurrence: c.recurrence || { type: "one-time" },
            messagePreview: c.messagePreview || "",
          });
        }

        setTemplates(templatesRes.data.templates || []);
        setTags(tagsRes.data.tags || []);
        setContacts(contactsRes.data.contacts || []);
        setGroups(groupsRes.data.groups || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load campaign");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field, id, checked) => {
    setForm((prev) => {
      const arr = prev[field] || [];
      if (checked) return { ...prev, [field]: [...arr, id] };
      return { ...prev, [field]: arr.filter((v) => v !== id) };
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        manualNumbers: form.manualNumbers
          ? form.manualNumbers.split("\n").filter((n) => n.trim() !== "")
          : [],
        scheduledDateTime: form.scheduledDateTime
          ? new Date(form.scheduledDateTime).toISOString()
          : null,
      };

      const res = await API.put(`/campaigns/${campaignId}`, payload);

      if (res.data.success) {
        if (res.data.pendingApproval) {
          alert("✅ Campaign updated! Sent to admin for approval.");
        }
        onUpdate(res.data.campaign);
        onClose();
      } else {
        throw new Error(res.data.error || "Update failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to update campaign"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={pageStyles.modalOverlay}>
        <div style={{ ...pageStyles.modalContent, textAlign: "center" }}>
          Loading campaign data...
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles.modalOverlay} onClick={onClose}>
      <div style={pageStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={pageStyles.modalHeader}>
          <h3 style={pageStyles.modalTitle}>Edit Campaign</h3>
          <button style={pageStyles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {!isSuperAdmin && (
          <div style={pageStyles.warningBox}>
            ⏳ Your edits will be sent to{" "}
            <strong>admin for approval</strong> before going live.
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger"
            style={{ fontSize: 13, padding: "10px 14px" }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={pageStyles.label}>Campaign Name *</label>
            <input
              type="text"
              style={pageStyles.formControl}
              value={form.campaignName}
              onChange={(e) => handleChange("campaignName", e.target.value)}
            />
          </div>

          <div>
            <label style={pageStyles.label}>Message Type</label>
            <select
              style={pageStyles.formControl}
              value={form.messageType}
              onChange={(e) => handleChange("messageType", e.target.value)}
            >
              <option value="Pre-approved template message">
                Pre-approved template message
              </option>
              <option value="Custom message">Custom message</option>
            </select>
          </div>

          {form.messageType === "Pre-approved template message" && (
            <div>
              <label style={pageStyles.label}>Template</label>
              <select
                style={pageStyles.formControl}
                value={form.templateId}
                onChange={(e) => handleChange("templateId", e.target.value)}
              >
                <option value="">-- Select template --</option>
                {templates.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={pageStyles.label}>Audience Type *</label>
            <select
              style={pageStyles.formControl}
              value={form.audienceType}
              onChange={(e) => handleChange("audienceType", e.target.value)}
            >
              <option value="tags">Tags</option>
              <option value="contact">Contacts</option>
              <option value="group">Groups</option>
              <option value="manual">Manual Numbers</option>
            </select>
          </div>

          {form.audienceType === "tags" && (
            <div>
              <label style={pageStyles.label}>Select Tags</label>
              <div style={pageStyles.checkboxGroup}>
                {tags.map((tag) => (
                  <div key={tag._id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`tag-${tag._id}`}
                      checked={form.tagIds.includes(tag._id)}
                      onChange={(e) =>
                        handleArrayToggle("tagIds", tag._id, e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`tag-${tag._id}`}
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.audienceType === "contact" && (
            <div>
              <label style={pageStyles.label}>Select Contacts</label>
              <div style={pageStyles.checkboxGroup}>
                {contacts.map((contact) => (
                  <div key={contact._id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`contact-${contact._id}`}
                      checked={form.contactIds.includes(contact._id)}
                      onChange={(e) =>
                        handleArrayToggle(
                          "contactIds",
                          contact._id,
                          e.target.checked
                        )
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`contact-${contact._id}`}
                    >
                      {contact.name} ({contact.mobile})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.audienceType === "group" && (
            <div>
              <label style={pageStyles.label}>Select Groups</label>
              <div style={pageStyles.checkboxGroup}>
                {groups.map((group) => (
                  <div key={group._id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`group-${group._id}`}
                      checked={form.groupIds.includes(group._id)}
                      onChange={(e) =>
                        handleArrayToggle(
                          "groupIds",
                          group._id,
                          e.target.checked
                        )
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`group-${group._id}`}
                    >
                      {group.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.audienceType === "manual" && (
            <div>
              <label style={pageStyles.label}>
                Manual Numbers (one per line)
              </label>
              <textarea
                style={pageStyles.textarea}
                rows={4}
                value={form.manualNumbers}
                onChange={(e) => handleChange("manualNumbers", e.target.value)}
                placeholder="+911234567890&#10;+919876543210"
              />
            </div>
          )}

          <div>
            <label style={pageStyles.label}>Scheduled Date & Time</label>
            <input
              type="datetime-local"
              style={pageStyles.formControl}
              value={form.scheduledDateTime}
              onChange={(e) =>
                handleChange("scheduledDateTime", e.target.value)
              }
            />
          </div>

          <div>
            <label style={pageStyles.label}>Recurrence</label>
            <select
              style={pageStyles.formControl}
              value={form.recurrence.type}
              onChange={(e) =>
                handleChange("recurrence", {
                  ...form.recurrence,
                  type: e.target.value,
                })
              }
            >
              <option value="one-time">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label style={pageStyles.label}>Message Preview</label>
            <textarea
              style={pageStyles.textarea}
              rows={3}
              value={form.messagePreview}
              onChange={(e) => handleChange("messagePreview", e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
          }}
        >
          <button
            onClick={onClose}
            style={{
              border: "1px solid #dbe5ee",
              borderRadius: 12,
              padding: "8px 20px",
              background: "#fff",
              fontWeight: 700,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: "linear-gradient(135deg,#1f7a85 0%,#0d5b63 100%)",
              border: "none",
              borderRadius: 12,
              padding: "8px 24px",
              color: "#fff",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Page Component ---------- */
export default function CampaignsPage() {
  const router = useRouter();
  const pageRef = useRef(null);
  const contentRef = useRef(null);
  const rowsRef = useRef([]);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [editingCampaignId, setEditingCampaignId] = useState(null);

  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 820);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      let id = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          id = userObj._id || userObj.id;
        }
      } catch (e) {}
      setUserRole(role || "");
      setUserId(id || "");
    }
  }, []);

  const isSuperAdmin = userRole === "super_admin";
  const isManager = userRole === "manager";
  const isManagerOrAbove = isSuperAdmin || isManager;

  const isOwner = (campaign) => {
    if (!userId) return false;
    const createdBy = campaign.createdBy;
    const ownerId = typeof createdBy === "object" ? createdBy?._id : createdBy;
    return ownerId?.toString() === userId;
  };

  const topTabs = ["All", "Broadcast", "API", "Scheduled"];

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
    if (userRole) fetchCampaigns();
  }, [userRole]);

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

  const mapCampaign = (camp) => {
    let audience = "Unknown";
    if (camp.audienceType === "tags" && camp.tagIds?.length) {
      audience = `${camp.tagIds.length} tag(s)`;
    } else if (
      camp.audienceType === "manual" &&
      camp.manualNumbers?.length
    ) {
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
    const totalSent = campaigns.reduce(
      (sum, c) => sum + (c.sentCount || 0),
      0
    );
    return { total, running, scheduled, totalSent };
  }, [campaigns]);

  const handleRefresh = () => {
    fetchCampaigns();
  };

  const handleUpdate = (updatedCampaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c._id === updatedCampaign._id ? updatedCampaign : c))
    );
  };

  const getApprovalBadge = (campaign) => {
    if (!campaign.approvalStatus || campaign.approvalStatus === "approved")
      return null;
    if (campaign.approvalStatus === "pending_approval") {
      return (
        <span style={pageStyles.approvalBadge}>⏳ Awaiting Approval</span>
      );
    }
    if (campaign.approvalStatus === "rejected") {
      return <span style={pageStyles.rejectedBadge}>❌ Rejected</span>;
    }
    return null;
  };

  // GSAP animations
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
  }, [isLoading, filteredData, activeTab]);

  rowsRef.current = [];

  // Prevent access for non‑manager roles
  if (userRole && !isManagerOrAbove) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 48 }}>🚫</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
          Access Restricted
        </div>
        <div style={{ fontSize: 14, color: "#64748b" }}>
          Campaigns are only accessible to managers and admins.
        </div>
      </div>
    );
  }

  const isPendingTab = activeTab === "PendingApprovals";

  return (
    <>
      {editingCampaignId && (
        <EditCampaignModal
          campaignId={editingCampaignId}
          onClose={() => setEditingCampaignId(null)}
          onUpdate={handleUpdate}
          isSuperAdmin={isSuperAdmin}
        />
      )}

      <div
        ref={pageRef}
        className="container-fluid py-2 py-md-4"
        style={pageStyles.shell}
      >
        <div className="d-flex flex-column gap-2 gap-md-4 h-100">
          {isLoading ? (
            <>
              <HeaderSkeleton />
              <StatsSkeleton />
              <SearchFilterSkeleton />
            </>
          ) : (
            <div
              ref={contentRef}
              className="d-flex flex-column gap-2 gap-md-4 h-100"
            >
              {/* ── Header ── */}
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
                  {/* Launch button in header — visible on desktop only */}
                  <button
                    style={pageStyles.launchBtn}
                    className="btn d-none d-lg-inline-flex align-items-center justify-content-center gap-2"
                    onClick={() => router.push("/Campaigns/launch")}
                    type="button"
                  >
                    <Plus size={16} />
                    Launch Campaign
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* ── Stats — 2-per-row on mobile, 4-per-row on xl ── */}
              <div className="row g-2 g-md-3">
                <div className="col-6 col-xl-3">
                  <StatCard
                    icon={Megaphone}
                    label="Total Campaigns"
                    value={stats.total}
                    subtext="All campaigns"
                  />
                </div>
                <div className="col-6 col-xl-3">
                  <StatCard
                    icon={PlayCircle}
                    label="Running"
                    value={stats.running}
                    subtext="Active now"
                  />
                </div>
                <div className="col-6 col-xl-3">
                  <StatCard
                    icon={CalendarDays}
                    label="Scheduled"
                    value={stats.scheduled}
                    subtext="Upcoming"
                  />
                </div>
                <div className="col-6 col-xl-3">
                  <StatCard
                    icon={Send}
                    label="Total Sent"
                    value={stats.totalSent}
                    subtext="Messages delivered"
                  />
                </div>
              </div>

              {/* ── Tabs / Filter pills ── */}
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {topTabs.map((tab) => (
                  <button
                    key={tab}
                    className="btn"
                    type="button"
                    style={{
                      ...pageStyles.filterPill,
                      ...(activeFilter === tab
                        ? pageStyles.filterPillActive
                        : {}),
                    }}
                    onClick={() => {
                      setActiveFilter(tab);
                      setActiveTab("All");
                    }}
                  >
                    {tab}
                  </button>
                ))}
                {isSuperAdmin && (
                  <button
                    onClick={() => setActiveTab("PendingApprovals")}
                    className="btn d-flex align-items-center gap-2"
                    style={{
                      ...pageStyles.filterPill,
                      ...(isPendingTab ? pageStyles.filterPillActive : {}),
                    }}
                  >
                    <Bell size={15} />
                    <span>Pending Approvals</span>
                  </button>
                )}
              </div>

              {isPendingTab && isSuperAdmin ? (
                <PendingApprovalsPanel
                  onApprove={(id) => {
                    setCampaigns((prev) =>
                      prev.map((c) =>
                        c._id === id
                          ? {
                              ...c,
                              approvalStatus: "approved",
                              status: "scheduled",
                            }
                          : c
                      )
                    );
                  }}
                  onReject={(id) => {
                    setCampaigns((prev) =>
                      prev.map((c) =>
                        c._id === id
                          ? {
                              ...c,
                              approvalStatus: "rejected",
                              status: "cancelled",
                            }
                          : c
                      )
                    );
                  }}
                />
              ) : (
                <>
                  {/* ── Toolbar ── */}
                  <div style={pageStyles.toolbarCard}>
                    <div className="d-flex flex-column flex-xl-row gap-2 gap-xl-3 justify-content-between align-items-stretch align-items-xl-center">
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

                      <div className="d-flex gap-2">
                        <button
                          className="btn d-inline-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-xl-grow-0"
                          style={pageStyles.refreshBtn}
                          onClick={handleRefresh}
                          type="button"
                        >
                          <RefreshCcw size={16} />
                          Refresh
                        </button>

                        {/* Launch button in toolbar — desktop only */}
                        <button
                          style={{
                            ...pageStyles.launchBtn,
                            minWidth: "unset",
                          }}
                          className="btn d-none d-xl-inline-flex align-items-center justify-content-center gap-2"
                          onClick={() => router.push("/Campaigns/launch")}
                          type="button"
                        >
                          <Plus size={16} />
                          Launch Campaign
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Mobile-only Launch button — full width below search */}
                    {isMobile && (
                      <div className="mt-2">
                        <button
                          style={{ ...pageStyles.launchBtn, width: "100%" }}
                          className="btn d-inline-flex align-items-center justify-content-center gap-2"
                          onClick={() => router.push("/Campaigns/launch")}
                          type="button"
                        >
                          <Plus size={16} />
                          Launch Campaign
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── Table ── */}
                  <div style={pageStyles.tableWrap}>
                    {/* Desktop header row */}
                    <div
                      className="d-none d-md-block px-3"
                      style={pageStyles.tableHeader}
                    >
                      <div className="row m-0 align-items-center">
                        <div className="col-md-3 py-3">Campaign</div>
                        <div className="col-md-2 py-3">Type</div>
                        <div className="col-md-1 py-3">Date</div>
                        <div className="col-md-1 py-3">Status</div>
                        <div className="col-md-1 py-3">Approval</div>
                        <div className="col-md-2 py-3">Audience</div>
                        <div className="col-md-2 py-3">Actions</div>
                      </div>
                    </div>

                    <div
                      style={{
                        maxHeight: "60vh",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    >
                      {filteredData.length > 0 ? (
                        filteredData.map((item, index) => {
                          const isUpdating = updatingId === item.id;
                          const isPaused = item.raw.status === "paused";
                          const canEdit =
                            isSuperAdmin || (isManager && isOwner(item.raw));
                          const canDelete =
                            isSuperAdmin || (isManager && isOwner(item.raw));

                          return (
                            <div
                              key={item.id}
                              ref={(el) => {
                                rowsRef.current[index] = el;
                              }}
                              className="px-3 py-2 py-md-3"
                              style={pageStyles.row}
                            >
                              {/* ── Mobile card ── */}
                              <div className="d-block d-md-none">
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: 6,
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: 700,
                                      color: "#0f172a",
                                      flex: 1,
                                      marginRight: 8,
                                    }}
                                  >
                                    {item.name}
                                  </div>
                                  {/* Action buttons inline top-right */}
                                  <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                                    {canEdit && (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleToggleStatus(item.raw)
                                          }
                                          disabled={isUpdating}
                                          style={{
                                            ...pageStyles.actionBtn,
                                            color: isPaused
                                              ? "#16a34a"
                                              : "#f59e0b",
                                            opacity: isUpdating ? 0.5 : 1,
                                          }}
                                          title={isPaused ? "Resume" : "Pause"}
                                        >
                                          {isPaused ? (
                                            <Play size={15} />
                                          ) : (
                                            <PauseCircle size={15} />
                                          )}
                                        </button>
                                        <button
                                          onClick={() =>
                                            setEditingCampaignId(item.id)
                                          }
                                          style={pageStyles.actionBtn}
                                          title="Edit"
                                        >
                                          <Edit size={15} />
                                        </button>
                                      </>
                                    )}
                                    {canDelete && (
                                      <button
                                        onClick={() =>
                                          handleDelete(item.id, item.name)
                                        }
                                        style={{
                                          ...pageStyles.actionBtn,
                                          color: "#dc2626",
                                        }}
                                        title="Delete"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Badges row */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 6,
                                    marginBottom: 6,
                                  }}
                                >
                                  <span
                                    style={{
                                      ...pageStyles.badgeBase,
                                      ...getTypeStyle(item.type),
                                      fontSize: 10,
                                      padding: "4px 10px",
                                    }}
                                  >
                                    {item.type}
                                  </span>
                                  <span
                                    style={{
                                      ...pageStyles.badgeBase,
                                      ...getStatusStyle(item.status),
                                      fontSize: 10,
                                      padding: "4px 10px",
                                    }}
                                  >
                                    {item.status}
                                  </span>
                                  {getApprovalBadge(item.raw)}
                                </div>

                                {/* Meta row */}
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 12,
                                    fontSize: 11,
                                    color: "#94a3b8",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <span>📅 {item.date}</span>
                                  <span>👥 {item.audience}</span>
                                  <span>📤 Sent {item.sent}</span>
                                </div>
                              </div>

                              {/* ── Desktop row ── */}
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
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#94a3b8",
                                    }}
                                  >
                                    Sent {item.sent}
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
                                <div className="col-md-1">
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
                                <div className="col-md-1">
                                  <span
                                    style={{
                                      ...pageStyles.badgeBase,
                                      ...getStatusStyle(item.status),
                                    }}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <div className="col-md-1">
                                  {getApprovalBadge(item.raw) || (
                                    <span
                                      style={{
                                        color: "#9ca3af",
                                        fontSize: 12,
                                      }}
                                    >
                                      —
                                    </span>
                                  )}
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
                                <div className="col-md-2">
                                  <div className="d-flex gap-1">
                                    {canEdit && (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleToggleStatus(item.raw)
                                          }
                                          disabled={isUpdating}
                                          style={{
                                            ...pageStyles.actionBtn,
                                            color: isPaused
                                              ? "#16a34a"
                                              : "#f59e0b",
                                            opacity: isUpdating ? 0.5 : 1,
                                          }}
                                          title={isPaused ? "Resume" : "Pause"}
                                        >
                                          {isPaused ? (
                                            <Play size={16} />
                                          ) : (
                                            <PauseCircle size={16} />
                                          )}
                                        </button>
                                        <button
                                          onClick={() =>
                                            setEditingCampaignId(item.id)
                                          }
                                          style={pageStyles.actionBtn}
                                          title="Edit"
                                        >
                                          <Edit size={16} />
                                        </button>
                                      </>
                                    )}
                                    {canDelete && (
                                      <button
                                        onClick={() =>
                                          handleDelete(item.id, item.name)
                                        }
                                        style={{
                                          ...pageStyles.actionBtn,
                                          color: "#dc2626",
                                        }}
                                        title="Delete"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    )}
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
                </>
              )}
            </div>
          )}
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

          /* ── Mobile stat card compaction ── */
          @media (max-width: 575px) {
            .stat-card-mobile {
              padding: 14px !important;
              border-radius: 16px !important;
            }
            .stat-icon-mobile {
              width: 34px !important;
              height: 34px !important;
              border-radius: 10px !important;
              margin-bottom: 8px !important;
            }
            .stat-label-mobile {
              font-size: 10px !important;
            }
            .stat-value-mobile {
              font-size: 20px !important;
              margin-top: 4px !important;
            }
            .stat-subtext-mobile {
              font-size: 10px !important;
              margin-top: 2px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}