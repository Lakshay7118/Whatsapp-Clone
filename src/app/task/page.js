"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  FiSearch, FiSend, FiPlus, FiX, FiBell, FiArrowLeft, FiInfo,
  FiTrash2, FiLink, FiPhone, FiChevronDown, FiMinus,
} from "react-icons/fi";
import API from "../utils/api";

/* ─────────────────────────────────────────────────────
   USER DISPLAY HELPERS
───────────────────────────────────────────────────── */
const PALETTE = [
  "#7c3aed","#ff5c35","#b98b00","#ff4d4f",
  "#4f46e5","#059669","#0891b2","#dc2626",
];
const userColor   = (id = "") => PALETTE[parseInt(("0000" + id).slice(-4), 16) % PALETTE.length];
const userInitial = (name = "") => (name || "?").trim().charAt(0).toUpperCase();
const enrichUser  = (u) => {
  if (!u) return null;
  const id = u._id?.toString?.() || u.id || "";
  return { ...u, id, initial: userInitial(u.name), color: userColor(id) };
};

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/* ─────────────────────────────────────────────────────
   DEMO USERS (fallback only)
───────────────────────────────────────────────────── */
const DEMO_USERS = [
  { _id: "REPLACE_ADMIN_ID",  name: "Lakshya (You)", role: "super_admin" },
  { _id: "REPLACE_USER1_ID",  name: "Prahlad Uday",  role: "user" },
  { _id: "REPLACE_USER2_ID",  name: "Hitesh",        role: "user" },
  { _id: "REPLACE_USER3_ID",  name: "Rahul",         role: "user" },
  { _id: "REPLACE_USER4_ID",  name: "Naveen",        role: "user" },
].map(enrichUser);

/* ─────────────────────────────────────────────────────
   CONFIGS
───────────────────────────────────────────────────── */
const PRIORITY_CONFIG = {
  low:    { label: "Low",    color: "#10b981", bg: "#d1fae5" },
  medium: { label: "Medium", color: "#f59e0b", bg: "#fef3c7" },
  high:   { label: "High",   color: "#ef4444", bg: "#fee2e2" },
};

const STATUS_CONFIG = {
  pending:     { label: "Pending",     color: "#6b7280", bg: "#f3f4f6", icon: "⏳" },
  in_progress: { label: "In Progress", color: "#3b82f6", bg: "#dbeafe", icon: "🔄" },
  completed:   { label: "Completed",   color: "#10b981", bg: "#d1fae5", icon: "✅" },
};

const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Math.floor((d - new Date()) / 86400000);
  if (diff === 0)  return "Today";
  if (diff === 1)  return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const isOverdue = (dueDate, status) =>
  status !== "completed" && dueDate && new Date(dueDate) < new Date();

/* ─────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────── */
const shimmerCSS = `
@keyframes tk-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}`;

function Skeleton({ width = "100%", height = 14, radius = 6, style = {} }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#e9edef",
        borderRadius: radius, width, height, flexShrink: 0, ...style }}>
      <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.6) 50%,transparent 100%)",
          animation: "tk-shimmer 1.6s ease-in-out infinite" }} />
    </div>
  );
}

function TaskPageSkeleton() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div style={{ width: 380, minWidth: 380, height: "100%", background: "#fff",
          borderRight: "1px solid #e9edef", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 59, background: "#f0f2f5", display: "flex", alignItems: "center",
            padding: "0 16px", gap: 12, borderBottom: "1px solid #e9edef" }}>
          <Skeleton width={40} height={40} radius={999} />
          <Skeleton width={100} height={13} />
        </div>
        <div style={{ padding: 8, borderBottom: "1px solid #e9edef" }}>
          <Skeleton height={36} radius={8} />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px",
              borderBottom: "1px solid #f0f2f5" }}>
            <Skeleton width={44} height={44} radius={10} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Skeleton width="60%" height={13} style={{ marginBottom: 8 }} />
              <Skeleton width="80%" height={11} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, background: "#efeae2" }} />
      <div style={{ width: 320, background: "#fff", borderLeft: "1px solid #e9edef" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   AVATAR
───────────────────────────────────────────────────── */
function Avatar({ user, size = 40 }) {
  if (!user) return null;
  const u = enrichUser(user);
  return (
    <div style={{ width: size, height: size, borderRadius: size < 32 ? 8 : "50%",
        background: "#dfe5e7", color: u.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: size * 0.38, flexShrink: 0 }}>
      {u.initial}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   BADGE
───────────────────────────────────────────────────── */
function Badge({ label, color, bg }) {
  return (
    <span style={{ fontSize: "0.7rem", fontWeight: 600, color, background: bg,
        padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   STATUS PILL
───────────────────────────────────────────────────── */
function StatusPill({ status, onChange, readonly }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[status];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => !readonly && setOpen((p) => !p)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
            borderRadius: 999, border: `1.5px solid ${cfg.color}30`,
            background: cfg.bg, cursor: readonly ? "default" : "pointer",
            fontSize: "0.78rem", fontWeight: 700, color: cfg.color }}>
        <span>{cfg.icon}</span> {cfg.label}
        {!readonly && <span style={{ fontSize: "0.6rem" }}>▼</span>}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0,
            background: "#fff", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,.14)",
            border: "1px solid #e9edef", overflow: "hidden", zIndex: 99, minWidth: 150 }}>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <div key={k} onClick={() => { onChange(k); setOpen(false); }}
              style={{ padding: "9px 14px", cursor: "pointer", display: "flex",
                  alignItems: "center", gap: 8, fontSize: "0.84rem", fontWeight: 600, color: v.color,
                  background: k === status ? v.bg : "#fff" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = v.bg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = k === status ? v.bg : "#fff")}>
              {v.icon} {v.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   NOTIFICATION PANEL
───────────────────────────────────────────────────── */
function NotificationPanel({ notifications, currentUser, onRead, onClose }) {
  const mine = notifications.filter(
    (n) => (n.userId?._id || n.userId)?.toString() === currentUser?.id
  );
  return (
    <div style={{ position: "absolute", top: 50, right: 0, background: "#fff",
        borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,.18)",
        border: "1px solid #e9edef", width: 340, maxHeight: 420,
        overflow: "hidden", display: "flex", flexDirection: "column", zIndex: 999 }}>
      <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f0f2f5",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111b21" }}>Notifications</span>
        <div style={{ display: "flex", gap: 8 }}>
          {mine.some((n) => !n.read) && (
            <button onClick={() => onRead("all")}
              style={{ background: "none", border: "none", cursor: "pointer",
                  fontSize: "0.75rem", color: "#00a884", fontWeight: 600 }}>
              Mark all read
            </button>
          )}
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#54656f" }}>
            <FiX size={16} />
          </button>
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {mine.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#667781", fontSize: "0.88rem" }}>
            No notifications yet
          </div>
        ) : (
          mine.map((n) => (
            <div key={n._id || n.id} onClick={() => onRead(n._id || n.id)}
              style={{ padding: "12px 16px", borderBottom: "1px solid #f0f2f5",
                  cursor: "pointer", background: n.read ? "#fff" : "#f0f9ff" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = n.read ? "#f7f8fa" : "#e0f2fe")}
              onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "#fff" : "#f0f9ff")}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.2rem" }}>
                  {n.type === "task_assigned" ? "📋" : n.type === "response_received" ? "💬" : "⏰"}
                </span>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#111b21", fontWeight: n.read ? 400 : 600 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#667781", marginTop: 3 }}>
                    {formatTime(n.createdAt || n.timestamp)}
                  </div>
                </div>
                {!n.read && (
                  <div style={{ width: 8, height: 8, borderRadius: "50%",
                      background: "#00a884", marginLeft: "auto", marginTop: 4, flexShrink: 0 }} />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   TASK FORM ELEMENTS
   • Collapsible via arrow toggle in header
   • Dropdown & checkbox options normalized (comma or newline)
───────────────────────────────────────────────────── */
function TaskFormElements({ task, values, onChange, onSubmit, readonly = false }) {
  const { quickReplies = [], inputFields = [], dropdownButtons = [], ctaButtons = [], checkboxes = [] } = task;
  const hasAny = quickReplies.length + inputFields.length + dropdownButtons.length + ctaButtons.length + checkboxes.length > 0;

  // ── collapse state lives inside the component ──
  const [collapsed, setCollapsed] = useState(false);

  if (!hasAny) return null;

  const inp = {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: "1.5px solid #e9edef", fontSize: "0.85rem", outline: "none",
    color: "#111b21", background: readonly ? "#f7f8fa" : "#fff", boxSizing: "border-box",
  };

  // Normalize options array — handles string, array, or null/undefined
  const normalizeOptions = (raw) => {
    if (typeof raw === "string") return raw.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
    if (Array.isArray(raw)) return raw.map((s) => String(s).trim()).filter(Boolean);
    return [];
  };

  return (
    <div style={{
      margin: "10px 16px 0",
      background: "rgba(255,255,255,0.9)", borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,.07)", flexShrink: 0,
      overflow: "hidden",
    }}>

      {/* ── Header / Toggle Row ── */}
      <div
        onClick={() => setCollapsed((p) => !p)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: collapsed ? "10px 16px" : "10px 16px 0 16px",
          cursor: "pointer", userSelect: "none",
        }}
      >
        <span style={{
          fontSize: "0.7rem", fontWeight: 700, color: "#00a884",
          textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          📝 Task Form {readonly && "(Submitted)"}
        </span>

        {/* Arrow rotates to point right when collapsed */}
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 24, height: 24, borderRadius: "50%",
          background: collapsed ? "#e7fef5" : "#f0f2f5",
          color: "#00a884", fontSize: "0.75rem",
          transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease, background 0.15s",
          flexShrink: 0,
        }}>
          ▼
        </span>
      </div>

      {/* ── Collapsible Body ── */}
      {!collapsed && (
        <div style={{ padding: "12px 16px 14px" }}>

          {/* Quick Replies */}
          {quickReplies.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: "0.75rem", color: "#54656f", fontWeight: 600, marginBottom: 6 }}>
                Quick Reply
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {quickReplies.map((qr) => {
                  const selected = values.quickReplySelected === qr.id;
                  return (
                    <button key={qr.id}
                      onClick={() => !readonly && onChange("quickReply", qr.id, qr.id)}
                      style={{
                        padding: "6px 16px", borderRadius: 999,
                        cursor: readonly ? "default" : "pointer",
                        border: `1.5px solid ${selected ? "#00a884" : "#d1d5db"}`,
                        background: selected ? "#d9fdd3" : "#f9fafb",
                        color: selected ? "#005c4b" : "#374151",
                        fontSize: "0.82rem", fontWeight: selected ? 700 : 500,
                      }}>
                      {qr.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Fields */}
          {inputFields.map((field) => (
            <div key={field.id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: "0.75rem", color: "#54656f", fontWeight: 600, marginBottom: 4 }}>
                {field.label || "Input"}{field.required && <span style={{ color: "#ef4444" }}> *</span>}
              </div>
              <input
                value={values.inputFields?.[field.id] || ""}
                onChange={(e) => !readonly && onChange("inputField", field.id, e.target.value)}
                placeholder={field.placeholder || "Enter value…"}
                disabled={readonly}
                style={inp}
              />
            </div>
          ))}

          {/* Dropdowns — comma or newline separated options */}
          {dropdownButtons.map((dd) => {
            const optionsArray = normalizeOptions(dd.options);
            return (
              <div key={dd.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: "0.75rem", color: "#54656f", fontWeight: 600, marginBottom: 4 }}>
                  {dd.title || "Select"}
                </div>
                <select
                  value={values.dropdownSelections?.[dd.id] || ""}
                  onChange={(e) => !readonly && onChange("dropdown", dd.id, e.target.value)}
                  disabled={readonly}
                  style={{ ...inp, appearance: "auto" }}
                >
                  <option value="">{dd.placeholder || "Select an option…"}</option>
                  {optionsArray.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            );
          })}

          {/* Checkbox Groups — comma or newline separated options */}
          {checkboxes.map((group) => {
            const selected = values.checkboxSelections?.[group.id] || [];
            const optionsArray = normalizeOptions(group.options);
            return (
              <div key={group.id} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: "0.75rem", color: "#54656f", fontWeight: 600, marginBottom: 6 }}>
                  {group.label || "Select options"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {optionsArray.map((opt) => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, cursor: readonly ? "default" : "pointer" }}>
                      <input
                        type="checkbox"
                        checked={selected.includes(opt)}
                        onChange={(e) => !readonly && onChange("checkbox", group.id, opt, e.target.checked)}
                        disabled={readonly}
                        style={{ accentColor: "#00a884", width: 16, height: 16 }}
                      />
                      <span style={{ fontSize: "0.85rem", color: "#111b21" }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          {/* CTA Buttons */}
          {ctaButtons.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {ctaButtons.map((btn) => (
                <a key={btn.id}
                  href={btn.btnType === "URL" ? btn.value : `tel:${btn.value}`}
                  target={btn.btnType === "URL" ? "_blank" : undefined}
                  rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 16px", borderRadius: 8, textDecoration: "none",
                    background: "#00a884", color: "#fff", fontSize: "0.82rem", fontWeight: 600,
                  }}>
                  {btn.btnType === "URL" ? <FiLink size={13} /> : <FiPhone size={13} />}
                  {btn.title}
                </a>
              ))}
            </div>
          )}

          {/* Submit Button */}
          {!readonly && (
            <button
              onClick={onSubmit}
              style={{
                marginTop: 16, padding: "10px 16px",
                background: "#00a884", color: "#fff",
                border: "none", borderRadius: 8,
                fontWeight: 700, fontSize: "0.85rem",
                cursor: "pointer", width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
              <FiSend size={14} /> Submit Response
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* Summary of formData shown inside response bubbles */
function FormDataSummary({ formData, task }) {
   console.log("FormDataSummary received:", JSON.stringify(formData, null, 2));
  if (!formData) return null;
  const { inputFields = [], dropdownSelections = [], quickReplySelected = "", checkboxSelections = [] } = formData;
  const items = [];

  if (quickReplySelected) {
    const qr = task?.quickReplies?.find((q) => q.id === quickReplySelected);
    if (qr) items.push({ label: "Quick Reply", value: qr.title });
  }
  inputFields.forEach((f) => {
    if (f.value) {
      const field = task?.inputFields?.find((x) => x.id === f.id);
      items.push({ label: field?.label || f.id, value: f.value });
    }
  });
  dropdownSelections.forEach((d) => {
    if (d.selected) {
      const dd = task?.dropdownButtons?.find((x) => x.id === d.id);
      items.push({ label: dd?.title || d.id, value: d.selected });
    }
  });
  const checkboxEntries = Array.isArray(checkboxSelections)
  ? checkboxSelections
  : Object.entries(checkboxSelections || {}).map(([id, selected]) => ({ id, selected }));

checkboxEntries.forEach((sel) => {
  const vals = Array.isArray(sel.selected)
    ? sel.selected.filter(Boolean)
    : sel.selected
    ? [String(sel.selected)]
    : [];
  if (vals.length) {
    const group = task?.checkboxes?.find((cb) => cb.id === sel.id);
    items.push({ label: group?.label || sel.id, value: vals.join(", ") });
  }
});

  if (!items.length) return null;
  return (
    <div style={{ marginTop: 6, padding: "6px 10px", background: "rgba(0,168,132,0.08)",
        borderRadius: 8, borderLeft: "2px solid #00a884" }}>
      {items.map((item, i) => (
        <div key={i} style={{ fontSize: "0.73rem", color: "#111b21",
            marginBottom: i < items.length - 1 ? 3 : 0 }}>
          <span style={{ color: "#00a884", fontWeight: 700 }}>{item.label}:</span>{" "}
          {item.value}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   CREATE TASK MODAL
   • Dropdown options: comma or newline separated
   • Checkbox options: comma or newline separated
───────────────────────────────────────────────────── */
function CreateTaskModal({ onClose, onCreate, currentUser, users }) {
  const isAdmin = currentUser?.role === "super_admin";

  const [assignFilter, setAssignFilter]       = useState("all");
  const [selectedTag, setSelectedTag]         = useState("");
  const [selectedMgr, setSelectedMgr]         = useState("");
  const [assignSearch, setAssignSearch]       = useState("");
  const [allManagers, setAllManagers]         = useState([]);
  const [allTags, setAllTags]                 = useState([]);
  const [tagContacts, setTagContacts]         = useState([]);
  const [mgrContacts, setMgrContacts]         = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", assignedTo: [],
    priority: "medium", dueDate: "", reminder: "", isPersonal: false,
    inputFields: [], dropdownButtons: [], quickReplies: [], ctaButtons: [], checkboxes: [],
  });
  const [tab, setTab] = useState("basic");

  // ── Fetch managers + tags on mount ──
  useEffect(() => {
    API.get("/contacts/managers")
      .then(res => setAllManagers(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});

    API.get("/contacts")
      .then(res => {
        const tagMap = new Map();
        (Array.isArray(res.data) ? res.data : []).forEach(c =>
          (c.tags || []).forEach(t => {
            if (t?._id) tagMap.set(t._id.toString(), t);
          })
        );
        setAllTags([...tagMap.values()]);
      })
      .catch(() => {});
  }, []);

  // ── Fetch contacts by tag ──
  useEffect(() => {
    if (assignFilter !== "tag" || !selectedTag) { setTagContacts([]); return; }
    setLoadingContacts(true);
    API.get(`/contacts?tag=${selectedTag}`)
      .then(res => setTagContacts(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoadingContacts(false));
  }, [assignFilter, selectedTag]);

  // ── Fetch contacts by manager ──
  useEffect(() => {
    if (assignFilter !== "manager_contacts" || !selectedMgr) { setMgrContacts([]); return; }
    setLoadingContacts(true);
    API.get(`/contacts?managerId=${selectedMgr}`)
      .then(res => setMgrContacts(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoadingContacts(false));
  }, [assignFilter, selectedMgr]);

  // ── Match contacts → users by phone ──
  const contactsWithUsers = useCallback((contactList) =>
    contactList.map(c => ({
      contact: c,
      user: users.find(u =>
        u.phone && c.mobile && (
          u.phone === c.mobile ||
          u.phone.replace(/\D/g, "") === c.mobile.replace(/\D/g, "")
        )
      ),
    })), [users]);

  // ── Final assignable list ──
  const assignableList = useMemo(() => {
    if (assignFilter === "tag") {
      return contactsWithUsers(tagContacts).filter(({ contact }) =>
        !assignSearch || contact.name?.toLowerCase().includes(assignSearch.toLowerCase())
      );
    }
    if (assignFilter === "manager_contacts") {
      return contactsWithUsers(mgrContacts).filter(({ contact }) =>
        !assignSearch || contact.name?.toLowerCase().includes(assignSearch.toLowerCase())
      );
    }
    return users
      .filter(u => {
        if (u.role === "super_admin") return false;
        if (assignFilter === "user"    && u.role !== "user")    return false;
        if (assignFilter === "manager" && u.role !== "manager") return false;
        if (assignSearch && !u.name?.toLowerCase().includes(assignSearch.toLowerCase())) return false;
        return true;
      })
      .map(u => ({ contact: null, user: u }));
  }, [assignFilter, users, tagContacts, mgrContacts, assignSearch, contactsWithUsers]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleAssign = (id) =>
    set("assignedTo", form.assignedTo.includes(id)
      ? form.assignedTo.filter(x => x !== id)
      : [...form.assignedTo, id]);

  const addInputField    = () => set("inputFields",     [...form.inputFields,     { id: genId(), label: "", placeholder: "", required: false }]);
  const addDropdown      = () => set("dropdownButtons", [...form.dropdownButtons, { id: genId(), title: "", placeholder: "", options: "" }]);
  const addQuickReply    = () => set("quickReplies",    [...form.quickReplies,    { id: genId(), title: "" }]);
  const addCtaButton     = () => set("ctaButtons",      [...form.ctaButtons,      { id: genId(), btnType: "URL", title: "", value: "" }]);
  const addCheckboxGroup = () => set("checkboxes",      [...form.checkboxes,      { id: genId(), label: "", options: "" }]);

  const patchArr  = (key, id, field, val) => set(key, form[key].map(x  => (x.id === id ? { ...x, [field]: val } : x)));
  const removeArr = (key, id)             => set(key, form[key].filter(x => x.id !== id));

  const parseOptions = (raw) => {
    if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
    if (typeof raw === "string") return raw.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    return [];
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const assignedTo      = form.isPersonal ? [currentUser.id] : form.assignedTo;
    const dropdownButtons = form.dropdownButtons.map(dd => ({ ...dd, options: parseOptions(dd.options) }));
    const checkboxes      = form.checkboxes.map(cb    => ({ ...cb, options: parseOptions(cb.options) }));
    onCreate({ ...form, assignedTo, dropdownButtons, checkboxes });
    onClose();
  };

  const inp = {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: "1.5px solid #e9edef", fontSize: "0.85rem", outline: "none",
    color: "#111b21", background: "#fff", boxSizing: "border-box",
  };
  const lbl = {
    fontSize: "0.72rem", fontWeight: 600, color: "#54656f",
    marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: "0.04em",
  };
  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)}
      style={{ padding: "6px 18px", borderRadius: 999, border: "none", cursor: "pointer",
          fontSize: "0.8rem", fontWeight: 700,
          background: tab === id ? "#00a884" : "#f0f2f5",
          color:      tab === id ? "#fff"    : "#54656f" }}>
      {label}
    </button>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div onClick={e => e.stopPropagation()} style={{
          background: "#fff", borderRadius: 16, width: 500, maxHeight: "90vh",
          overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,.22)" }}>

        {/* ── Header ── */}
        <div style={{ padding: "18px 20px 12px", borderBottom: "1px solid #f0f2f5",
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111b21" }}>
            {isAdmin ? "Create New Task" : "Create Personal Task"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#54656f" }}>
            <FiX size={20} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 8, padding: "10px 20px",
            borderBottom: "1px solid #f0f2f5", background: "#f7f8fa" }}>
          {tabBtn("basic", "📋 Basic Info")}
          {tabBtn("form",  "🧩 Form Elements")}
        </div>

        {/* ── Body ── */}
        <div style={{ overflowY: "auto", padding: "16px 20px", flex: 1,
            display: "flex", flexDirection: "column", gap: 12 }}>

          {/* ════ BASIC INFO TAB ════ */}
          {tab === "basic" && (
            <>
              <div>
                <label style={lbl}>Task Title *</label>
                <input value={form.title} onChange={e => set("title", e.target.value)}
                  placeholder="Enter task title…" style={inp} />
              </div>

              <div>
                <label style={lbl}>Description</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  placeholder="Add details…" rows={3}
                  style={{ ...inp, resize: "none", fontFamily: "inherit" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={lbl}>Priority</label>
                  <select value={form.priority} onChange={e => set("priority", e.target.value)} style={inp}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} style={inp} />
                </div>
              </div>

              <div>
                <label style={lbl}>Reminder</label>
                <input type="datetime-local" value={form.reminder}
                  onChange={e => set("reminder", e.target.value)} style={inp} />
              </div>

              {/* ── Personal toggle ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", background: "#f7f8fa", borderRadius: 10, border: "1.5px solid #e9edef" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#111b21" }}>Personal Task</div>
                  <div style={{ fontSize: "0.77rem", color: "#667781" }}>Only visible to you</div>
                </div>
                <div onClick={() => set("isPersonal", !form.isPersonal)}
                  style={{ width: 44, height: 24, borderRadius: 999, cursor: "pointer",
                      background: form.isPersonal ? "#00a884" : "#ccd0d5", position: "relative", transition: "background .2s" }}>
                  <div style={{ position: "absolute", top: 2, width: 20, height: 20, borderRadius: "50%",
                      background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                      left: form.isPersonal ? 22 : 2, transition: "left .2s" }} />
                </div>
              </div>

              {/* ── Assign To ── */}
              {isAdmin && !form.isPersonal && (
                <div>
                  <label style={lbl}>Assign To</label>

                  {/* Filter pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {[
                      { id: "all",              label: "👥 All" },
                      { id: "user",             label: "🙋 Users" },
                      { id: "manager",          label: "💼 Managers" },
                      { id: "tag",              label: "🔖 By Tag" },
                      { id: "manager_contacts", label: "📋 Manager's Contacts" },
                    ].map(f => (
                      <button key={f.id}
                        onClick={() => { setAssignFilter(f.id); setSelectedTag(""); setSelectedMgr(""); }}
                        style={{
                          padding: "4px 12px", borderRadius: 999, border: "1.5px solid",
                          fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
                          borderColor: assignFilter === f.id ? "#00a884" : "#e9edef",
                          background:  assignFilter === f.id ? "#d9fdd3" : "#f0f2f5",
                          color:       assignFilter === f.id ? "#005c4b" : "#54656f",
                        }}>
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Tag selector */}
                  {assignFilter === "tag" && (
                    <select value={selectedTag} onChange={e => setSelectedTag(e.target.value)}
                      style={{ ...inp, marginBottom: 8, appearance: "auto" }}>
                      <option value="">— Select a tag —</option>
                      {allTags.map(t => (
                        <option key={t._id} value={t._id}>{t.name || t._id}</option>
                      ))}
                    </select>
                  )}

                  {/* Manager selector */}
                  {assignFilter === "manager_contacts" && (
                    <select value={selectedMgr} onChange={e => setSelectedMgr(e.target.value)}
                      style={{ ...inp, marginBottom: 8, appearance: "auto" }}>
                      <option value="">— Select a manager —</option>
                      {allManagers.map(m => (
                        <option key={m._id} value={m._id}>{m.name}</option>
                      ))}
                    </select>
                  )}

                  {/* Search */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 10px",
                      height: 34, borderRadius: 8, background: "#f0f2f5", marginBottom: 8 }}>
                    <FiSearch size={13} color="#54656f" />
                    <input value={assignSearch} onChange={e => setAssignSearch(e.target.value)}
                      placeholder="Search people…"
                      style={{ flex: 1, background: "transparent", border: "none",
                          outline: "none", fontSize: "0.82rem", color: "#111b21" }} />
                    {assignSearch && (
                      <button onClick={() => setAssignSearch("")}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#54656f", padding: 0 }}>
                        <FiX size={12} />
                      </button>
                    )}
                  </div>

                  {/* People list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4,
                      border: "1.5px solid #e9edef", borderRadius: 10, padding: 8,
                      maxHeight: 200, overflowY: "auto" }}>

                    {loadingContacts ? (
                      <div style={{ padding: "12px 0", textAlign: "center", fontSize: "0.8rem", color: "#667781" }}>
                        Loading…
                      </div>
                    ) : assignableList.length === 0 ? (
                      <div style={{ padding: "12px 0", textAlign: "center", fontSize: "0.8rem", color: "#667781" }}>
                        {assignFilter === "tag" && !selectedTag
                          ? "Select a tag first"
                          : assignFilter === "manager_contacts" && !selectedMgr
                          ? "Select a manager first"
                          : "No people found"}
                      </div>
                    ) : (
                      assignableList.map(({ contact, user }) => {
                        const id       = user?.id || user?._id?.toString();
                        const name     = user?.name || contact?.name || "Unknown";
                        const subtitle = user
                          ? `${user.role}${contact ? " · " + contact.mobile : ""}`
                          : `${contact?.mobile || ""} · no account`;
                        const canAssign = !!id;
                        const checked   = id ? form.assignedTo.includes(id) : false;
                        const rowKey    = contact?._id?.toString() || id || Math.random().toString();

                        return (
                          <label key={rowKey} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            cursor: canAssign ? "pointer" : "not-allowed",
                            padding: "6px 6px", borderRadius: 8,
                            opacity: canAssign ? 1 : 0.45,
                            background: checked ? "#e7fef5" : "transparent",
                          }}>
                            <input type="checkbox"
                              checked={checked}
                              disabled={!canAssign}
                              onChange={() => canAssign && toggleAssign(id)}
                              style={{ accentColor: "#00a884" }} />
                            <Avatar user={user || { name, id: "" }} size={30} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "0.86rem", fontWeight: 500, color: "#111b21" }}>{name}</div>
                              <div style={{ fontSize: "0.7rem", textTransform: "capitalize",
                                  color: canAssign ? "#667781" : "#ef4444" }}>
                                {subtitle}{!canAssign && " ⚠ not registered"}
                              </div>
                            </div>
                            {checked && <span style={{ color: "#00a884", fontSize: "0.75rem", fontWeight: 700 }}>✓</span>}
                          </label>
                        );
                      })
                    )}
                  </div>

                  {/* Selected count + clear */}
                  {form.assignedTo.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: "0.75rem", color: "#00a884", fontWeight: 600 }}>
                      {form.assignedTo.length} person{form.assignedTo.length > 1 ? "s" : ""} selected
                      <button onClick={() => set("assignedTo", [])}
                        style={{ marginLeft: 10, background: "none", border: "none",
                            cursor: "pointer", color: "#ef4444", fontSize: "0.72rem", fontWeight: 600 }}>
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ════ FORM ELEMENTS TAB ════ */}
          {tab === "form" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { label: "+ Input Field",   action: addInputField },
                  { label: "+ Dropdown",       action: addDropdown },
                  { label: "+ Quick Reply",    action: addQuickReply },
                  { label: "+ CTA Button",     action: addCtaButton },
                  { label: "+ Checkbox Group", action: addCheckboxGroup },
                ].map(({ label, action }) => (
                  <button key={label} onClick={action}
                    style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px dashed #00a884",
                        background: "#f0fdf9", color: "#00a884", fontSize: "0.78rem",
                        fontWeight: 700, cursor: "pointer" }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Input Fields */}
              {form.inputFields.map(f => (
                <FieldRow key={f.id} title="Input Field" onRemove={() => removeArr("inputFields", f.id)}>
                  <input placeholder="Label" value={f.label}
                    onChange={e => patchArr("inputFields", f.id, "label", e.target.value)}
                    style={{ ...inp, marginBottom: 6 }} />
                  <input placeholder="Placeholder" value={f.placeholder}
                    onChange={e => patchArr("inputFields", f.id, "placeholder", e.target.value)}
                    style={{ ...inp, marginBottom: 6 }} />
                  <label style={{ display: "flex", alignItems: "center", gap: 6,
                      fontSize: "0.78rem", cursor: "pointer", color: "#54656f" }}>
                    <input type="checkbox" checked={f.required}
                      onChange={e => patchArr("inputFields", f.id, "required", e.target.checked)}
                      style={{ accentColor: "#00a884" }} />
                    Required
                  </label>
                </FieldRow>
              ))}

              {/* Dropdowns */}
              {form.dropdownButtons.map(dd => (
                <FieldRow key={dd.id} title="Dropdown" onRemove={() => removeArr("dropdownButtons", dd.id)}>
                  <input placeholder="Title" value={dd.title}
                    onChange={e => patchArr("dropdownButtons", dd.id, "title", e.target.value)}
                    style={{ ...inp, marginBottom: 6 }} />
                  <input placeholder="Placeholder" value={dd.placeholder}
                    onChange={e => patchArr("dropdownButtons", dd.id, "placeholder", e.target.value)}
                    style={{ ...inp, marginBottom: 6 }} />
                  <div style={{ fontSize: "0.72rem", color: "#667781", marginBottom: 4 }}>
                    Options — separate by <strong>comma</strong> or <strong>newline</strong>
                  </div>
                  <textarea
                    placeholder="Option A, Option B, Option C"
                    value={typeof dd.options === "string" ? dd.options : (Array.isArray(dd.options) ? dd.options.join(", ") : "")}
                    onChange={e => patchArr("dropdownButtons", dd.id, "options", e.target.value)}
                    rows={3} style={{ ...inp, resize: "none", fontFamily: "inherit" }} />
                </FieldRow>
              ))}

              {/* Quick Replies */}
              {form.quickReplies.map(qr => (
                <FieldRow key={qr.id} title="Quick Reply" onRemove={() => removeArr("quickReplies", qr.id)}>
                  <input placeholder="Button label (e.g. Yes, Approved)" value={qr.title}
                    onChange={e => patchArr("quickReplies", qr.id, "title", e.target.value)}
                    style={inp} />
                </FieldRow>
              ))}

              {/* CTA Buttons */}
              {form.ctaButtons.map(btn => (
                <FieldRow key={btn.id} title="CTA Button" onRemove={() => removeArr("ctaButtons", btn.id)}>
                  <select value={btn.btnType}
                    onChange={e => patchArr("ctaButtons", btn.id, "btnType", e.target.value)}
                    style={{ ...inp, marginBottom: 6, appearance: "auto" }}>
                    <option value="URL">URL</option>
                    <option value="Phone Number">Phone Number</option>
                  </select>
                  <input placeholder="Button label" value={btn.title}
                    onChange={e => patchArr("ctaButtons", btn.id, "title", e.target.value)}
                    style={{ ...inp, marginBottom: 6 }} />
                  <input
                    placeholder={btn.btnType === "URL" ? "https://example.com" : "+91 98765 43210"}
                    value={btn.value}
                    onChange={e => patchArr("ctaButtons", btn.id, "value", e.target.value)}
                    style={inp} />
                </FieldRow>
              ))}

              {/* Checkbox Groups */}
              {form.checkboxes.map(cb => (
                <FieldRow key={cb.id} title="Checkbox Group" onRemove={() => removeArr("checkboxes", cb.id)}>
                  <input placeholder="Label (e.g. Select your interests)" value={cb.label}
                    onChange={e => patchArr("checkboxes", cb.id, "label", e.target.value)}
                    style={{ ...inp, marginBottom: 6 }} />
                  <div style={{ fontSize: "0.72rem", color: "#667781", marginBottom: 4 }}>
                    Options — separate by <strong>comma</strong> or <strong>newline</strong>
                  </div>
                  <textarea
                    placeholder="Option A, Option B, Option C"
                    value={typeof cb.options === "string" ? cb.options : (Array.isArray(cb.options) ? cb.options.join(", ") : "")}
                    onChange={e => patchArr("checkboxes", cb.id, "options", e.target.value)}
                    rows={3} style={{ ...inp, resize: "none", fontFamily: "inherit" }} />
                </FieldRow>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f2f5",
            display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose}
            style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e9edef",
                background: "#fff", cursor: "pointer", fontSize: "0.88rem",
                color: "#54656f", fontWeight: 600 }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!form.title.trim()}
            style={{ padding: "9px 20px", borderRadius: 8, border: "none",
                background: form.title.trim() ? "#00a884" : "#ccd0d5",
                color: "#fff", cursor: form.title.trim() ? "pointer" : "not-allowed",
                fontSize: "0.88rem", fontWeight: 700 }}>
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ title, onRemove, children }) {
  return (
    <div style={{ border: "1.5px solid #e9edef", borderRadius: 10, padding: 12, position: "relative", background: "#fafafa" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#00a884", textTransform: "uppercase", letterSpacing: "0.04em" }}>{title}</span>
        <button onClick={onRemove} style={{ background: "#fee2e2", border: "none", borderRadius: 6, cursor: "pointer", padding: "2px 6px", color: "#ef4444" }}><FiMinus size={13} /></button>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   TASK CARD
───────────────────────────────────────────────────── */
function TaskCard({ task, selected, onClick }) {
  const overdue   = isOverdue(task.dueDate, task.status);
  const pCfg      = PRIORITY_CONFIG[task.priority];
  const sCfg      = STATUS_CONFIG[task.status];
  const assignees = (task.assignedTo || []).map(enrichUser).filter(Boolean);

  return (
    <div onClick={onClick}
      style={{ padding: "12px 14px", borderBottom: "1px solid #f0f2f5", cursor: "pointer",
          background: selected ? "#e7fef5" : "#fff", transition: "background .15s",
          borderLeft: selected ? "3px solid #00a884" : "3px solid transparent" }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "#f7f8fa"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "#fff"; }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: pCfg.color, marginTop: 5, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111b21", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: task.status === "completed" ? "line-through" : "none" }}>
              {task.isPersonal && <span style={{ marginRight: 4 }}>🔒</span>}{task.title}
            </div>
            <span style={{ fontSize: "0.68rem", color: overdue ? "#ef4444" : "#667781", fontWeight: overdue ? 700 : 400, flexShrink: 0 }}>
              {task.dueDate ? (overdue ? "⚠ " : "") + formatDate(task.dueDate) : ""}
            </span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#667781", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 8 }}>{task.description || "No description"}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
              {assignees.slice(0, 3).map((u, i) => (
                <div key={u.id} style={{ width: 22, height: 22, borderRadius: "50%", background: "#dfe5e7", color: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, border: "2px solid #fff", marginLeft: i > 0 ? -6 : 0 }}>{u.initial}</div>
              ))}
              {assignees.length > 3 && <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#e9edef", color: "#54656f", fontSize: "0.58rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", marginLeft: -6 }}>+{assignees.length - 3}</div>}
            </div>
            <div style={{ fontSize: "0.68rem", color: sCfg.color, fontWeight: 600 }}>{sCfg.icon} {sCfg.label}</div>
          </div>
        </div>
      </div>
      {task.responses?.length > 0 && (
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #f0f2f5", fontSize: "0.72rem", color: "#667781" }}>
          💬 {task.responses.length} response{task.responses.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   INFO CARD
───────────────────────────────────────────────────── */
function InfoCard({ title, icon, children }) {
  return (
    <div style={{ background: "#fff", marginBottom: 8, padding: "12px 16px" }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#008069", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────── */
export default function TaskPage() {
  const [isLoading, setIsLoading]           = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState("");
  const [currentUser, setCurrentUser]       = useState(null);
  const [users, setUsers]                   = useState(DEMO_USERS);
  const [tasks, setTasks]                   = useState([]);
  const [notifications, setNotifications]   = useState([]);
  const [selectedTask, setSelectedTask]     = useState(null);
  const [showCreate, setShowCreate]         = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [responseInput, setResponseInput]   = useState("");
  const [filter, setFilter]                 = useState("all");
  const [search, setSearch]                 = useState("");
  const [isMobile, setIsMobile]             = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [formValues, setFormValues]         = useState({
    inputFields: {},
    dropdownSelections: {},
    quickReplySelected: "",
    checkboxSelections: {},
  });

  const scrollRef = useRef(null);
  const notifRef  = useRef(null);

  // Fetch current user
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(enrichUser(JSON.parse(userStr))); } catch {}
    } else {
      API.get("/users/me")
        .then(res => { if (res.data.success) setCurrentUser(enrichUser(res.data.data)); })
        .catch(() => {});
    }
  }, []);

  // Load tasks & notifications
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const [tRes, nRes] = await Promise.all([
          API.get("/tasks"),
          API.get("/tasks/notifications"),
        ]);
        if (tRes.data.success) setTasks(tRes.data.data);
        if (nRes.data.success) setNotifications(nRes.data.data);
      } catch { setError("Failed to load tasks."); }
      setIsLoading(false);
    })();
  }, [currentUser]);

  // Fetch users for assignment
  useEffect(() => {
    API.get("/users")
      .then(res => { if (res.data.success) setUsers(res.data.data.map(enrichUser)); })
      .catch(() => {});
  }, []);

  // Resize handler
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 820);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // Scroll to bottom on task/responses change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [selectedTask, tasks]);

  // Click outside notifications panel
  useEffect(() => {
    const fn = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifPanel(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Reset form values when task changes
  useEffect(() => {
    setFormValues({ inputFields: {}, dropdownSelections: {}, quickReplySelected: "", checkboxSelections: {} });
  }, [selectedTask?._id || selectedTask?.id]);

  const handleFormChange = useCallback((type, id, value, checked) => {
    if (type === "quickReply") {
      setFormValues(p => ({ ...p, quickReplySelected: p.quickReplySelected === id ? "" : id }));
    } else if (type === "inputField") {
      setFormValues(p => ({ ...p, inputFields: { ...p.inputFields, [id]: value } }));
    } else if (type === "dropdown") {
      setFormValues(p => ({ ...p, dropdownSelections: { ...p.dropdownSelections, [id]: value } }));
    } else if (type === "checkbox") {
      setFormValues(p => {
        const current = p.checkboxSelections[id] || [];
        const next = checked ? [...current, value] : current.filter(v => v !== value);
        return { ...p, checkboxSelections: { ...p.checkboxSelections, [id]: next } };
      });
    }
  }, []);

  const handleCreate = useCallback(async (form) => {
    setSaving(true);
    try {
      const res = await API.post("/tasks", form);
      if (res.data.success) {
        setTasks(p => [res.data.data, ...p]);
        setSelectedTask(res.data.data);
      } else setError(res.data.message || "Failed to create task");
    } catch { setError("Network error"); }
    setSaving(false);
  }, []);

  const handleResponse = useCallback(async () => {
    const taskId = selectedTaskLive?._id || selectedTaskLive?.id;
    if (!taskId) return;
    const hasText = responseInput.trim().length > 0;
    const hasForm = formValues.quickReplySelected ||
      Object.values(formValues.inputFields).some(Boolean) ||
      Object.values(formValues.dropdownSelections).some(Boolean) ||
      Object.values(formValues.checkboxSelections).some(arr => arr.length > 0);
    if (!hasText && !hasForm) return;

    const formData = {
      inputFields: Object.entries(formValues.inputFields).map(([id, value]) => ({ id, value })),
      dropdownSelections: Object.entries(formValues.dropdownSelections).map(([id, selected]) => ({ id, selected })),
      quickReplySelected: formValues.quickReplySelected,
      checkboxSelections: Object.entries(formValues.checkboxSelections).map(([id, selected]) => ({ id, selected })),
    };
    console.log("SENDING formData:", JSON.stringify(formData, null, 2));
    setSaving(true);
    try {
      const res = await API.post(`/tasks/${taskId}/response`, { message: responseInput.trim(), formData });
      console.log("SERVER RETURNED responses:", JSON.stringify(res.data.data?.responses?.slice(-1), null, 2));

      if (res.data.success) {
        setTasks(p => p.map(t => ((t._id || t.id) === taskId ? res.data.data : t)));
        setSelectedTask(res.data.data);
        setResponseInput("");
        setFormValues({ inputFields: {}, dropdownSelections: {}, quickReplySelected: "", checkboxSelections: {} });
      }
    } catch { setError("Failed to send response"); }
    setSaving(false);
  }, [responseInput, formValues, selectedTask]);

  const handleStatusChange = useCallback(async (taskId, newStatus) => {
    try {
      const res = await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      if (res.data.success) {
        setTasks(p => p.map(t => ((t._id || t.id) === taskId ? res.data.data : t)));
        if ((selectedTask?._id || selectedTask?.id) === taskId) setSelectedTask(res.data.data);
      }
    } catch { setError("Failed to update status"); }
  }, [selectedTask]);

  const handleDelete = useCallback(async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(p => p.filter(t => (t._id || t.id) !== taskId));
      if ((selectedTask?._id || selectedTask?.id) === taskId) setSelectedTask(null);
    } catch { setError("Failed to delete task"); }
  }, [selectedTask]);

  const handleReadNotif = useCallback(async (id) => {
    if (id === "all") {
      await API.patch("/tasks/notifications/read-all");
      setNotifications(p => p.map(n => ({ ...n, read: true })));
    } else {
      await API.patch(`/tasks/notifications/${id}/read`);
      setNotifications(p => p.map(n => ((n._id || n.id) === id ? { ...n, read: true } : n)));
    }
  }, []);

  const visibleTasks = useMemo(() => tasks.filter(task => {
    if (currentUser?.role !== "super_admin") {
      const isAssigned = task.assignedTo?.some(u => (u._id || u.id || u)?.toString() === currentUser?.id);
      const isOwner = task.isPersonal && (task.createdBy?._id || task.createdBy?.id || task.createdBy)?.toString() === currentUser?.id;
      if (!isAssigned && !isOwner) return false;
    }
    if (filter !== "all" && task.status !== filter) return false;
    if (search && !task.title?.toLowerCase().includes(search.toLowerCase()) && !task.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tasks, currentUser, filter, search]);

  const unreadCount = notifications.filter(n =>
    !n.read && (n.userId?._id || n.userId)?.toString() === currentUser?.id
  ).length;

  const selectedTaskLive = useMemo(() =>
    tasks.find(t => (t._id || t.id) === (selectedTask?._id || selectedTask?.id)) || selectedTask,
    [tasks, selectedTask]
  );

  if (!currentUser) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      Loading user...
    </div>
  );

  return (
    <>
      <style>{shimmerCSS}</style>
      <style>{`
        html, body { height: 100%; overflow: hidden; }
        .task-shell { position: fixed; top: 70px; left: 88px; right: 0; bottom: 0; overflow: hidden; background: #f0f2f5; padding: 0 10px; }
        .task-chat-bg { background-color: #efeae2; background-image: radial-gradient(rgba(255,255,255,.5) 1px, transparent 1px); background-size: 28px 28px; }
        .scroll-hidden { overflow-y: auto; overflow-x: hidden; scrollbar-width: none; -ms-overflow-style: none; }
        .scroll-hidden::-webkit-scrollbar { display: none; }
        .task-send-btn:hover { transform: scale(1.04); }
        @media (max-width: 820px) { .task-shell { top: 60px; left: 0; } }
      `}</style>

      {error && (
        <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", background: "#fee2e2", color: "#dc2626", padding: "10px 20px", borderRadius: 10, fontSize: "0.85rem", fontWeight: 600, zIndex: 99999 }}>
          {error}
          <button onClick={() => setError("")} style={{ marginLeft: 12, background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}><FiX size={14} /></button>
        </div>
      )}

      <div className="task-shell">
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          {isLoading ? <TaskPageSkeleton /> : (
            <>
              {/* ── LEFT PANEL ── */}
              {(!isMobile || !mobileChatOpen) && (
                <div style={{ width: isMobile ? "100%" : 380, minWidth: isMobile ? "100%" : 380, height: "100%", background: "#fff", borderRight: "1px solid #e9edef", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ height: 59, background: "#f0f2f5", borderBottom: "1px solid #e9edef", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#00a884", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem" }}>✅</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#111b21" }}>Tasks</div>
                        <div style={{ fontSize: "0.7rem", color: "#667781" }}>{visibleTasks.length} task{visibleTasks.length !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div ref={notifRef} style={{ position: "relative" }}>
                        <button onClick={() => setShowNotifPanel(p => !p)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: showNotifPanel ? "#d9fdd3" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#54656f", position: "relative" }}>
                          <FiBell size={18} />
                          {unreadCount > 0 && <div style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</div>}
                        </button>
                        {showNotifPanel && <NotificationPanel notifications={notifications} currentUser={currentUser} onRead={handleReadNotif} onClose={() => setShowNotifPanel(false)} />}
                      </div>
                      {currentUser?.role === "super_admin" && (
                        <button onClick={() => setShowCreate(true)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "#00a884", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                          <FiPlus size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search */}
                  <div style={{ padding: 8, borderBottom: "1px solid #f0f2f5" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 36, borderRadius: 8, background: "#f0f2f5" }}>
                      <FiSearch size={14} color="#54656f" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "0.88rem", color: "#111b21" }} />
                      {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#54656f", padding: 0 }}><FiX size={13} /></button>}
                    </div>
                  </div>

                  {/* Filters */}
                  <div style={{ display: "flex", gap: 6, padding: "8px 10px", borderBottom: "1px solid #f0f2f5", overflowX: "auto", flexShrink: 0 }}>
                    {[
                      { id: "all",         label: "All" },
                      { id: "pending",     label: "⏳ Pending" },
                      { id: "in_progress", label: "🔄 In Progress" },
                      { id: "completed",   label: "✅ Done" },
                    ].map(t => (
                      <button key={t.id} onClick={() => setFilter(t.id)} style={{ padding: "4px 12px", borderRadius: 999, border: "1.5px solid", fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer", borderColor: filter === t.id ? "#00a884" : "#e9edef", background: filter === t.id ? "#d9fdd3" : "#f0f2f5", color: filter === t.id ? "#005c4b" : "#54656f" }}>{t.label}</button>
                    ))}
                  </div>

                  {/* Task List */}
                  <div className="scroll-hidden" style={{ flex: 1 }}>
                    {visibleTasks.length === 0 ? (
                      <div style={{ padding: 32, textAlign: "center", color: "#667781" }}>
                        <div style={{ fontSize: "2rem", marginBottom: 8 }}>📋</div>
                        <div style={{ fontSize: "0.88rem" }}>{search ? "No tasks match your search" : "No tasks yet"}</div>
                        {currentUser?.role === "super_admin" && !search && (
                          <button onClick={() => setShowCreate(true)} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, border: "none", background: "#00a884", color: "#fff", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>+ Create First Task</button>
                        )}
                      </div>
                    ) : visibleTasks.map(task => (
                      <TaskCard
                        key={task._id || task.id}
                        task={task}
                        selected={(selectedTaskLive?._id || selectedTaskLive?.id) === (task._id || task.id)}
                        onClick={() => { setSelectedTask(task); if (isMobile) setMobileChatOpen(true); }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── CENTER PANEL ── */}
              {(!isMobile || mobileChatOpen) && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }} className="task-chat-bg">
                  {!selectedTaskLive ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#667781" }}>
                      <div style={{ background: "rgba(255,255,255,.7)", borderRadius: 16, padding: "32px 40px", textAlign: "center", maxWidth: 340 }}>
                        <div style={{ fontSize: "3rem", marginBottom: 12 }}>✅</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111b21", marginBottom: 8 }}>Task Manager</div>
                        <div style={{ fontSize: "0.88rem", lineHeight: 1.6 }}>Select a task to view details and respond.</div>
                        {currentUser?.role === "super_admin" && (
                          <button onClick={() => setShowCreate(true)} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 10, border: "none", background: "#00a884", color: "#fff", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer" }}>+ Create Task</button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Center header */}
                      <div style={{ height: 59, background: "#f0f2f5", borderBottom: "1px solid #e9edef", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          {isMobile && <button onClick={() => setMobileChatOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#54656f" }}><FiArrowLeft size={20} /></button>}
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: PRIORITY_CONFIG[selectedTaskLive.priority]?.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                            {selectedTaskLive.priority === "high" ? "🔴" : selectedTaskLive.priority === "medium" ? "🟡" : "🟢"}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: "0.94rem", fontWeight: 700, color: "#111b21", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedTaskLive.title}</div>
                            <div style={{ fontSize: "0.72rem", color: "#667781" }}>
                              {selectedTaskLive.responses?.length || 0} response{selectedTaskLive.responses?.length !== 1 ? "s" : ""}
                              {selectedTaskLive.dueDate && ` · Due ${formatDate(selectedTaskLive.dueDate)}`}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                          <StatusPill
                            status={selectedTaskLive.status}
                            readonly={currentUser?.role === "user" && !selectedTaskLive.assignedTo?.some(u => (u._id || u.id || u)?.toString() === currentUser?.id)}
                            onChange={s => handleStatusChange(selectedTaskLive._id || selectedTaskLive.id, s)}
                          />
                          <button onClick={() => setShowRightPanel(p => !p)} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: showRightPanel ? "#d9fdd3" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: showRightPanel ? "#00a884" : "#54656f" }}>
                            <FiInfo size={17} />
                          </button>
                          {currentUser?.role === "super_admin" && (
                            <button onClick={() => handleDelete(selectedTaskLive._id || selectedTaskLive.id)} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Task description */}
                      {selectedTaskLive.description && (
                        <div style={{ margin: "12px 16px 0", padding: "12px 14px", background: "rgba(255,255,255,.85)", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,.08)", flexShrink: 0, borderLeft: "3px solid #00a884" }}>
                          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#00a884", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Task Description</div>
                          <div style={{ fontSize: "0.88rem", color: "#111b21", lineHeight: 1.6 }}>{selectedTaskLive.description}</div>
                        </div>
                      )}

                      {/* Collapsible Task Form */}
                      <TaskFormElements
                        task={selectedTaskLive}
                        values={formValues}
                        onSubmit={handleResponse}
                        onChange={handleFormChange}
                        readonly={false}
                      />

                      {/* Responses scroll area */}
                      <div ref={scrollRef} className="scroll-hidden" style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
                        {(!selectedTaskLive.responses || selectedTaskLive.responses.length === 0) ? (
                          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#667781", fontSize: "0.84rem", textAlign: "center", padding: 24 }}>
                            <div><div style={{ fontSize: "1.8rem", marginBottom: 6 }}>💬</div>No responses yet.</div>
                          </div>
                        ) : (
                          selectedTaskLive.responses.map(resp => {
                            const sender = enrichUser(resp.userId);
                            const isMine = sender?.id === currentUser?.id;
                            return (
                              <div key={resp._id || resp.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", gap: 8 }}>
                                {!isMine && <Avatar user={sender} size={32} />}
                                <div style={{ maxWidth: "68%" }}>
                                  {!isMine && <div style={{ fontSize: "0.72rem", color: sender?.color || "#667781", fontWeight: 700, marginBottom: 2, paddingLeft: 4 }}>{sender?.name || "Unknown"}</div>}
                                  <div style={{ padding: "8px 12px", borderRadius: isMine ? "12px 12px 0 12px" : "12px 12px 12px 0", background: isMine ? "#d9fdd3" : "#fff", boxShadow: "0 1px 2px rgba(0,0,0,.1)", fontSize: "0.88rem", color: "#111b21", lineHeight: 1.5 }}>
                                    {resp.message && <div>{resp.message}</div>}
                                    <FormDataSummary formData={resp.formData} task={selectedTaskLive} />
                                  </div>
                                  <div style={{ fontSize: "0.66rem", color: "#667781", textAlign: isMine ? "right" : "left", marginTop: 2, paddingLeft: 4, paddingRight: 4 }}>
                                    {formatTime(resp.createdAt || resp.timestamp)}{isMine && " ✓✓"}
                                  </div>
                                </div>
                                {isMine && <Avatar user={currentUser} size={32} />}
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Reply input bar */}
                      <div style={{ padding: "10px 12px", background: "#f0f2f5", borderTop: "1px solid #e9edef", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                        <input
                          value={responseInput}
                          onChange={e => setResponseInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleResponse()}
                          placeholder="Write a response… (or fill the form above)"
                          style={{ flex: 1, height: 42, borderRadius: 24, border: "none", padding: "0 16px", fontSize: "0.9rem", outline: "none", background: "#fff", color: "#111b21" }}
                        />
                        <button onClick={handleResponse} className="task-send-btn" disabled={saving} style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: saving ? "#ccd0d5" : "#00a884", color: "#fff", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s, background .2s", flexShrink: 0 }}>
                          <FiSend size={17} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── RIGHT PANEL ── */}
              {!isMobile && showRightPanel && selectedTaskLive && (
                <div style={{ width: 300, minWidth: 300, height: "100%", background: "#fff", borderLeft: "1px solid #e9edef", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ height: 59, background: "#f0f2f5", borderBottom: "1px solid #e9edef", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.92rem", color: "#111b21" }}>Task Info</div>
                  <div className="scroll-hidden" style={{ flex: 1, background: "#f7f8fa" }}>
                    <InfoCard title="Status" icon="📊">
                      <StatusPill status={selectedTaskLive.status} onChange={s => handleStatusChange(selectedTaskLive._id || selectedTaskLive.id, s)} readonly={currentUser?.role === "user"} />
                    </InfoCard>
                    <InfoCard title="Priority" icon="🚩">
                      <Badge label={PRIORITY_CONFIG[selectedTaskLive.priority]?.label} color={PRIORITY_CONFIG[selectedTaskLive.priority]?.color} bg={PRIORITY_CONFIG[selectedTaskLive.priority]?.bg} />
                    </InfoCard>
                    {selectedTaskLive.dueDate && (
                      <InfoCard title="Due Date" icon="📅">
                        <span style={{ fontSize: "0.88rem", fontWeight: 600, color: isOverdue(selectedTaskLive.dueDate, selectedTaskLive.status) ? "#ef4444" : "#111b21" }}>
                          {isOverdue(selectedTaskLive.dueDate, selectedTaskLive.status) && "⚠ "}
                          {new Date(selectedTaskLive.dueDate).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </InfoCard>
                    )}
                    {selectedTaskLive.reminder && (
                      <InfoCard title="Reminder" icon="⏰">
                        <span style={{ fontSize: "0.84rem", color: "#667781" }}>
                          {new Date(selectedTaskLive.reminder).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </InfoCard>
                    )}
                    <InfoCard title="Created By" icon="👤">
                      {(() => {
                        const creator = enrichUser(selectedTaskLive.createdBy);
                        return creator ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Avatar user={creator} size={28} />
                            <span style={{ fontSize: "0.85rem", color: "#111b21", fontWeight: 500 }}>{creator.name}</span>
                          </div>
                        ) : null;
                      })()}
                    </InfoCard>
                    {!selectedTaskLive.isPersonal && selectedTaskLive.assignedTo?.length > 0 && (
                      <InfoCard title="Assigned To" icon="👥">
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {selectedTaskLive.assignedTo.map(u => {
                            const eu = enrichUser(u);
                            return eu ? (
                              <div key={eu.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Avatar user={eu} size={28} />
                                <div>
                                  <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "#111b21" }}>{eu.name}</div>
                                  <div style={{ fontSize: "0.7rem", color: "#667781" }}>{eu.role}</div>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </InfoCard>
                    )}
                    {selectedTaskLive.isPersonal && (
                      <InfoCard title="Visibility" icon="🔒">
                        <span style={{ fontSize: "0.82rem", color: "#667781" }}>Personal — only you can see this</span>
                      </InfoCard>
                    )}
                    {(() => {
                      const count = (selectedTaskLive.inputFields?.length || 0) + (selectedTaskLive.dropdownButtons?.length || 0) + (selectedTaskLive.quickReplies?.length || 0) + (selectedTaskLive.ctaButtons?.length || 0) + (selectedTaskLive.checkboxes?.length || 0);
                      return count > 0 ? (
                        <InfoCard title="Form Elements" icon="🧩">
                          <div style={{ fontSize: "0.8rem", color: "#54656f", display: "flex", flexDirection: "column", gap: 4 }}>
                            {selectedTaskLive.inputFields?.length > 0 && <span>📝 {selectedTaskLive.inputFields.length} input field{selectedTaskLive.inputFields.length > 1 ? "s" : ""}</span>}
                            {selectedTaskLive.dropdownButtons?.length > 0 && <span>🔽 {selectedTaskLive.dropdownButtons.length} dropdown{selectedTaskLive.dropdownButtons.length > 1 ? "s" : ""}</span>}
                            {selectedTaskLive.quickReplies?.length > 0 && <span>⚡ {selectedTaskLive.quickReplies.length} quick repl{selectedTaskLive.quickReplies.length > 1 ? "ies" : "y"}</span>}
                            {selectedTaskLive.ctaButtons?.length > 0 && <span>🔗 {selectedTaskLive.ctaButtons.length} CTA button{selectedTaskLive.ctaButtons.length > 1 ? "s" : ""}</span>}
                            {selectedTaskLive.checkboxes?.length > 0 && <span>☑️ {selectedTaskLive.checkboxes.length} checkbox group{selectedTaskLive.checkboxes.length > 1 ? "s" : ""}</span>}
                          </div>
                        </InfoCard>
                      ) : null;
                    })()}
                    <InfoCard title="Responses" icon="💬">
                      <div style={{ fontSize: "0.88rem", color: "#111b21", fontWeight: 700 }}>{selectedTaskLive.responses?.length || 0}</div>
                      {selectedTaskLive.responses?.length > 0 && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                          {Array.from(new Set(selectedTaskLive.responses.map(r => enrichUser(r.userId)?.id).filter(Boolean))).map(uid => {
                            const u = enrichUser(selectedTaskLive.responses.find(r => enrichUser(r.userId)?.id === uid)?.userId);
                            const count = selectedTaskLive.responses.filter(r => enrichUser(r.userId)?.id === uid).length;
                            return u ? (
                              <div key={uid} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Avatar user={u} size={22} />
                                <span style={{ fontSize: "0.78rem", color: "#54656f" }}>{u.name} ({count})</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </InfoCard>
                    <InfoCard title="Created" icon="🕐">
                      <span style={{ fontSize: "0.82rem", color: "#667781" }}>
                        {new Date(selectedTaskLive.createdAt).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </InfoCard>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateTaskModal
          currentUser={currentUser}
          users={users.length ? users : DEMO_USERS}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}