"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BASE =
  process.env.NEXT_PUBLIC_BACKEND ||
  "https://${process.env.NEXT_PUBLIC_BACKEND_URL}";

const API_BASE = `${BASE}/api`;

// ── Helper: get tag name safely ──────────────────────────────────────────────
const getTagName = (tag) => tag?.name || tag?.tagName || "";

// ── Add Tag Modal (no category) ──────────────────────────────────────────────
function AddTagModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim()) return setError("Tag name is required.");
    setError("");
    onAdd({ name: name.trim() });
    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a2233" }}>Add Tag</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Create a new tag to organize your contacts</p>
          </div>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {error && (
          <p style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, background: "#fdf0f0", padding: "8px 12px", borderRadius: 6 }}>
            {error}
          </p>
        )}

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Tag Name <span style={{ color: "#e74c3c" }}>*</span></label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. VIP, New Lead, Support"
            style={inputStyle}
            autoFocus
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={secondaryBtn}>Cancel</button>
          <button onClick={submit} style={primaryBtn}>Create</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit First Message Modal ────────────────────────────────────────────────
function EditMessageModal({ tag, onClose, onSave }) {
  const [msg, setMsg] = useState(tag.firstMessage || "");
  const tagName = getTagName(tag);

  return (
    <div style={overlay}>
      <div style={{ ...modalBox, width: 500 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a2233" }}>
            First Message — <span style={{ color: "#0d9488" }}>{tagName}</span>
          </h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={5}
          placeholder="Type the first message sent when this tag is assigned…"
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          <button onClick={onClose} style={secondaryBtn}>Cancel</button>
          <button onClick={() => { onSave(msg); onClose(); }} style={primaryBtn}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: isActive ? "#dcfce7" : "#fee2e2",
        color: isActive ? "#16a34a" : "#dc2626",
        borderRadius: 20,
        padding: "3px 12px",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: isActive ? "#16a34a" : "#dc2626",
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMsg, setEditingMsg] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch tags from backend
  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_BASE}/tags`);
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data = await res.json();
      setTags(data.tags || []);
    } catch (err) {
      console.error(err);
      alert("Could not load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Add tag (POST)
  const addTag = async (newTag) => {
    const userId = localStorage.getItem("userId") || "test_user";
    const payload = { name: newTag.name, createdBy: userId };
    try {
      const res = await fetch(`${API_BASE}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create tag");
      const data = await res.json();
      setTags((prev) => [data.tag, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle status (PUT)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`${API_BASE}/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setTags((prev) => prev.map((t) => (t._id === id ? data.tag : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete tag (DELETE)
  const deleteTag = async (id) => {
    if (!confirm("Delete this tag? It will be removed from all contacts.")) return;
    try {
      const res = await fetch(`${API_BASE}/tags/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setTags((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Save first message (PUT)
  const saveMessage = async (id, message) => {
    try {
      const res = await fetch(`${API_BASE}/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstMessage: message }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setTags((prev) => prev.map((t) => (t._id === id ? data.tag : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter tags based on search (safe access)
  const filtered = tags.filter((t) => {
    const tagName = getTagName(t);
    return tagName.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div style={pageWrap}>
        <div style={{ textAlign: "center", padding: 40 }}>Loading tags...</div>
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      {/* Back + Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <button onClick={() => router.push("/contacts")} style={backBtn}>← Back</button>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1a2233" }}>Tags</h1>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>
            Manage tags to categorize and segment your contacts
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={toolbar}>
        <div style={{ position: "relative" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags…"
            style={{ ...inputStyle, width: 260, paddingLeft: 36 }}
          />
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
              fontSize: 15,
            }}
          >
            🔍
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowAddModal(true)} style={primaryBtn}>
          + Add Tag
        </button>
      </div>

      {/* Table */}
      <div style={tableWrap}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Tag Name", "First Message", "Status", "Action"].map((h) => (
                <th
                  key={h}
                  style={{ ...th, textAlign: h === "Action" ? "center" : "left" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "56px 0", color: "#9ca3af", fontSize: 14 }}>
                  {tags.length === 0
                    ? 'No tags yet. Click "+ Add Tag" to create one.'
                    : "No tags match your search."}
                </td>
              </tr>
            )}
            {filtered.map((t, i) => (
              <tr
                key={t._id}
                style={{
                  borderBottom: "1px solid #f3f4f6",
                  background: i % 2 === 0 ? "#fff" : "#fafafa",
                }}
              >
                {/* Tag Name */}
                <td style={td}>
                  <span
                    style={{
                      background: "#fde8e8",
                      color: "#c0392b",
                      borderRadius: 6,
                      padding: "3px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {getTagName(t)}
                  </span>
                </td>

                {/* First Message */}
                <td style={{ ...td, maxWidth: 260 }}>
                  {t.firstMessage ? (
                    <span
                      style={{ color: "#374151", cursor: "pointer", textDecoration: "underline dotted" }}
                      onClick={() => setEditingMsg(t)}
                      title="Click to edit"
                    >
                      {t.firstMessage.length > 60 ? t.firstMessage.slice(0, 57) + "…" : t.firstMessage}
                    </span>
                  ) : (
                    <button
                      onClick={() => setEditingMsg(t)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#0d9488",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        padding: 0,
                      }}
                    >
                      + Set message
                    </button>
                  )}
                </td>

                {/* Status */}
                <td style={td}>
                  <StatusBadge status={t.status} />
                </td>

                {/* Action */}
                <td style={{ ...td, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button
                      onClick={() => toggleStatus(t._id, t.status)}
                      title={t.status === "Active" ? "Deactivate" : "Activate"}
                      style={iconBtn(t.status === "Active" ? "#f59e0b" : "#10b981")}
                    >
                      {t.status === "Active" ? "⏸" : "▶"}
                    </button>
                    <button
                      onClick={() => setEditingMsg(t)}
                      title="Edit first message"
                      style={iconBtn("#6366f1")}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTag(t._id)}
                      title="Delete tag"
                      style={iconBtn("#ef4444")}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{ marginTop: 14, fontSize: 13, color: "#6b7280", textAlign: "right" }}>
        {filtered.length} tag{filtered.length !== 1 ? "s" : ""}
        {filtered.length !== tags.length ? ` (filtered from ${tags.length})` : ""}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTagModal onClose={() => setShowAddModal(false)} onAdd={addTag} />
      )}
      {editingMsg && (
        <EditMessageModal
          tag={editingMsg}
          onClose={() => setEditingMsg(null)}
          onSave={(msg) => saveMessage(editingMsg._id, msg)}
        />
      )}
    </div>
  );
}

// ── Styles (unchanged) ────────────────────────────────────────────────────────
const pageWrap = {
  minHeight: "100vh",
  background: "#f3f4f6",
  padding: "28px 32px",
  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
};

const toolbar = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
  flexWrap: "wrap",
};

const tableWrap = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  overflow: "hidden",
};

const th = {
  padding: "12px 16px",
  fontWeight: 700,
  fontSize: 13,
  color: "#0d9488",
  whiteSpace: "nowrap",
};

const td = {
  padding: "13px 16px",
  color: "#374151",
  fontSize: 14,
  verticalAlign: "middle",
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  color: "#1a2233",
  background: "#fff",
};

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 5,
};

const primaryBtn = {
  background: "#0d9488",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "9px 18px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const secondaryBtn = {
  background: "#fff",
  color: "#374151",
  border: "1.5px solid #d1d5db",
  borderRadius: 8,
  padding: "9px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const backBtn = {
  background: "#fff",
  border: "1.5px solid #d1d5db",
  borderRadius: 8,
  padding: "7px 14px",
  fontSize: 13,
  cursor: "pointer",
  color: "#374151",
  fontWeight: 600,
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalBox = {
  background: "#fff",
  borderRadius: 14,
  padding: "28px 32px",
  width: 440,
  maxWidth: "95vw",
  boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
};

const closeBtn = {
  background: "none",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  color: "#6b7280",
  padding: "0 4px",
};

const iconBtn = (color) => ({
  background: color + "18",
  border: "none",
  borderRadius: 7,
  padding: "5px 9px",
  cursor: "pointer",
  fontSize: 14,
  color,
  fontWeight: 700,
  transition: "background 0.15s",
});
