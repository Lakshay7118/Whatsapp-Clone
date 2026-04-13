"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND + "/api" ||
  "https://whatsapp-backend-production-308a.up.railway.app/api";

// ── TagBadge ──────────────────────────────────────────────────────────────
function TagBadge({ label }) {
  return (
    <span
      style={{
        background: "#fde8e8",
        color: "#c0392b",
        borderRadius: 6,
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.2,
      }}
    >
      {label}
    </span>
  );
}

// ── AddContactModal (unchanged) ─────────────────────────────────────────────
function AddContactModal({ onClose, onAdd, availableTags }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    tagId: "",
    source: "MANUAL",
  });
  const [error, setError] = useState("");

  const handle = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = () => {
    const cleanMobile = form.mobile.replace(/\s/g, "").trim();

    if (!cleanMobile) {
      return setError("Mobile number is required.");
    }

    if (!/^\d{10,15}$/.test(cleanMobile)) {
      return setError("Enter a valid mobile number (10–15 digits).");
    }

    setError("");

    onAdd({
      name: form.name.trim() || "UNKNOWN",
      mobile: cleanMobile,
      tags: form.tagId ? [form.tagId] : [],
      source: form.source,
    });

    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a2233" }}>Add Contact</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {error && (
          <p style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, background: "#fdf0f0", padding: "8px 12px", borderRadius: 6 }}>
            {error}
          </p>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Name</label>
          <input value={form.name} onChange={handle("name")} placeholder="Full name (optional)" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Mobile Number *</label>
          <input value={form.mobile} onChange={handle("mobile")} placeholder="e.g. 919876543210" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Tag</label>
          <select value={form.tagId} onChange={handle("tagId")} style={inputStyle}>
            <option value="">Select a tag</option>
            {availableTags.map((tag) => (
              <option key={tag._id} value={tag._id}>{tag.name || tag.tagName}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Source</label>
          <select value={form.source} onChange={handle("source")} style={inputStyle}>
            <option value="ORGANIC">ORGANIC</option>
            <option value="IMPORTED">IMPORTED</option>
            <option value="MANUAL">MANUAL</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={secondaryBtn}>Cancel</button>
          <button onClick={submit} style={primaryBtn}>Add Contact</button>
        </div>
      </div>
    </div>
  );
}

// ── NEW: EditContactModal ───────────────────────────────────────────────────
function EditContactModal({ contact, onClose, onUpdate, availableTags }) {
  const [form, setForm] = useState({
    name: contact.name || "",
    mobile: contact.mobile || "",
    tagId: contact.tags && contact.tags.length > 0 ? contact.tags[0]._id : "",
    source: contact.source || "MANUAL",
  });
  const [error, setError] = useState("");

  const handle = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = () => {
    const cleanMobile = form.mobile.replace(/\s/g, "").trim();

    if (!cleanMobile) {
      return setError("Mobile number is required.");
    }

    if (!/^\d{10,15}$/.test(cleanMobile)) {
      return setError("Enter a valid mobile number (10–15 digits).");
    }

    setError("");

    onUpdate(contact._id, {
      name: form.name.trim() || "UNKNOWN",
      mobile: cleanMobile,
      tags: form.tagId ? [form.tagId] : [],
      source: form.source,
    });

    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a2233" }}>Edit Contact</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {error && (
          <p style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, background: "#fdf0f0", padding: "8px 12px", borderRadius: 6 }}>
            {error}
          </p>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Name</label>
          <input value={form.name} onChange={handle("name")} placeholder="Full name (optional)" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Mobile Number *</label>
          <input value={form.mobile} onChange={handle("mobile")} placeholder="e.g. 919876543210" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Tag</label>
          <select value={form.tagId} onChange={handle("tagId")} style={inputStyle}>
            <option value="">Select a tag</option>
            {availableTags.map((tag) => (
              <option key={tag._id} value={tag._id}>{tag.name || tag.tagName}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Source</label>
          <select value={form.source} onChange={handle("source")} style={inputStyle}>
            <option value="ORGANIC">ORGANIC</option>
            <option value="IMPORTED">IMPORTED</option>
            <option value="MANUAL">MANUAL</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={secondaryBtn}>Cancel</button>
          <button onClick={submit} style={primaryBtn}>Update Contact</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ContactsPage ─────────────────────────────────────────────────────
export default function ContactsPage() {
  const router = useRouter();

  const [contacts, setContacts] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null); // for edit modal
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [filterTagId, setFilterTagId] = useState("");
  const [loading, setLoading] = useState(true);

  const PER_PAGE = 25;

  // Fetch contacts (with optional tag filter)
  const fetchContacts = async () => {
    try {
      const url = filterTagId ? `${API_BASE}/contacts?tag=${filterTagId}` : `${API_BASE}/contacts`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_BASE}/tags`);
      const data = await res.json();
      setTags(data.tags || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [filterTagId]);

  // Add contact
  const addContact = async (contact) => {
    try {
      const userId = localStorage.getItem("userId") || "test_user";
      const payload = { ...contact, createdBy: userId };
      const res = await fetch(`${API_BASE}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create contact");
      const newContact = await res.json();
      setContacts((prev) => [newContact, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔥 NEW: Update contact
  const updateContact = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update contact");
      }
      const updatedContact = await res.json();
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? updatedContact : c))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete single contact
  const deleteSingleContact = async (contactId, contactName) => {
    if (!confirm(`Delete "${contactName}" permanently?`)) return;
    try {
      const res = await fetch(`${API_BASE}/contacts/${contactId}`, { method: "DELETE" });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== contactId));
        const newSelected = new Set(selected);
        newSelected.delete(contactId);
        setSelected(newSelected);
      } else {
        alert("Failed to delete contact");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk delete
  const deleteSelected = async () => {
    const idsToDelete = Array.from(selected);
    if (idsToDelete.length === 0) return;
    if (!confirm(`Delete ${idsToDelete.length} contact(s)?`)) return;
    try {
      await Promise.all(idsToDelete.map((id) => fetch(`${API_BASE}/contacts/${id}`, { method: "DELETE" })));
      setContacts((prev) => prev.filter((c) => !selected.has(c._id)));
      setSelected(new Set());
    } catch (err) {
      alert("Error deleting selected contacts");
    }
  };

  // Filter contacts by search (name, mobile, tag name)
  const filtered = contacts.filter((c) => {
    const tagNames = (c.tags || []).map((tag) => tag.name || tag.tagName || "").join(" ");
    return (
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile?.includes(search) ||
      tagNames.toLowerCase().includes(search.toLowerCase())
    );
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const toggleAll = () => {
    if (selected.size === paged.length && paged.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((c) => c._id)));
    }
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  // Helper to get tag name from tag object
  const getTagName = (tag) => {
    if (typeof tag === "string") return tag;
    return tag?.name || tag?.tagName || "";
  };

  if (loading) return <div style={pageWrap}>Loading contacts...</div>;

  return (
    <div style={pageWrap}>
      <div style={contentShell}>
        {/* Quick Guide */}
        <div style={guideBanner}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a2233" }}>Quick Guide</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              Import contact, create audience & launch campaign, all from one place.
            </p>
          </div>
          <div style={{ display: "flex", gap: 28, marginTop: 14, flexWrap: "wrap" }}>
            <a href="#" style={guideLink}>📋 Import upto 2 lakh contacts in one go</a>
            <a href="#" style={guideLink}>▶ Watch Tutorial</a>
          </div>
        </div>

        {/* Toolbar */}
        <div style={toolbar}>
          <div style={{ position: "relative" }}>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, mobile, or tag"
              style={{ ...inputStyle, width: 260, paddingLeft: 36 }}
            />
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 15 }}>🔍</span>
          </div>

          <select value={filterTagId} onChange={(e) => setFilterTagId(e.target.value)} style={{ ...inputStyle, width: 150 }}>
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>{getTagName(tag)}</option>
            ))}
          </select>

          <button style={filterBtn}>⚙ Filter</button>

          <div style={{ flex: 1 }} />

          {selected.size > 0 && (
            <button onClick={deleteSelected} style={{ ...secondaryBtn, color: "#e74c3c", borderColor: "#e74c3c" }}>
              Delete ({selected.size})
            </button>
          )}

          <button style={{ ...primaryBtn, opacity: 0.45, cursor: "default" }}>BROADCAST</button>
          <button style={{ ...primaryBtn, background: "#fff", color: "#374151", border: "1px solid #d1d5db" }}>Run Ad</button>

          <button onClick={() => router.push("/Tags")} style={{ ...primaryBtn, background: "#fff", color: "#0d9488", border: "1.5px solid #0d9488" }}>
            🏷 Add Tag
          </button>

          <button onClick={() => setShowAddModal(true)} style={primaryBtn}>+ Add Contact</button>

          <button style={{ ...primaryBtn, background: "#fff", color: "#374151", border: "1px solid #d1d5db" }}>Import ▾</button>
          <button style={{ ...primaryBtn, background: "#fff", color: "#374151", border: "1px solid #d1d5db" }}>Actions ▾</button>
        </div>

        {/* Table */}
        <div style={tableCard}>
          <div style={tableScroll}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th style={stickyTh}><input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={toggleAll} /></th>
                  <th style={{ ...stickyTh, textAlign: "left" }}>Name</th>
                  <th style={{ ...stickyTh, textAlign: "left" }}>Mobile Number</th>
                  <th style={{ ...stickyTh, textAlign: "left" }}>Tags</th>
                  <th style={{ ...stickyTh, textAlign: "left" }}>Source</th>
                  <th style={{ ...stickyTh, textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: 14 }}>
                      No contacts found. Click "+ Add Contact" to get started.
                    </td>
                  </tr>
                )}
                {paged.map((c, i) => (
                  <tr key={c._id} style={{ borderBottom: "1px solid #f3f4f6", background: selected.has(c._id) ? "#f0fdf4" : i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={td}><input type="checkbox" checked={selected.has(c._id)} onChange={() => toggleOne(c._id)} /></td>
                    <td style={td}>{c.name}</td>
                    <td style={td}>{c.mobile}</td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {c.tags && c.tags.length > 0 ? (
                          c.tags.map((tag, idx) => <TagBadge key={idx} label={getTagName(tag)} />)
                        ) : <span style={{ color: "#9ca3af" }}>—</span>}
                      </div>
                    </td>
                    <td style={{ ...td, fontWeight: c.source ? 600 : 400, color: c.source ? "#374151" : "#9ca3af" }}>{c.source || "—"}</td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setEditingContact(c)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 16 }}
                          title="Edit contact"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteSingleContact(c._id, c.name)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#dc3545", fontSize: 16 }}
                          title="Delete contact"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div style={paginationRow}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={pageBtn(currentPage === 1)}>‹</button>
          <span style={{ fontSize: 13, color: "#374151" }}>
            {total === 0 ? "0–0 of 0" : `${(currentPage - 1) * PER_PAGE + 1}–${Math.min(currentPage * PER_PAGE, total)} of ${total}`}
          </span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={pageBtn(currentPage === totalPages)}>›</button>
          <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>{PER_PAGE} per page</span>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAdd={addContact}
          availableTags={tags}
        />
      )}

      {editingContact && (
        <EditContactModal
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onUpdate={updateContact}
          availableTags={tags}
        />
      )}
    </div>
  );
}

// ── Styles (same as before) ────────────────────────────────────────────────
const pageWrap = {
  width: "100%",
  height: "100%",
  minHeight: 0,
  background: "#f3f4f6",
  padding: "28px 32px 20px",
  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  overflow: "hidden",
  boxSizing: "border-box",
};
const contentShell = {
  width: "100%",
  height: "100%",
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};
const guideBanner = {
  background: "#fff",
  borderRadius: 12,
  padding: "20px 24px",
  marginBottom: 20,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  flexShrink: 0,
};
const guideLink = {
  color: "#0d9488",
  fontSize: 13,
  textDecoration: "none",
  fontWeight: 500,
};
const toolbar = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
  flexWrap: "wrap",
  flexShrink: 0,
};
const tableCard = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
};
const tableScroll = {
  height: "100%",
  overflowY: "auto",
  overflowX: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};
const stickyTh = {
  padding: "12px 16px",
  fontWeight: 600,
  fontSize: 13,
  color: "#0d9488",
  whiteSpace: "nowrap",
  background: "#f9fafb",
  position: "sticky",
  top: 0,
  zIndex: 2,
};
const td = {
  padding: "12px 16px",
  color: "#374151",
  fontSize: 14,
};
const paginationRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  marginTop: 16,
  flexShrink: 0,
};
const pageBtn = (disabled) => ({
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  padding: "4px 12px",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.4 : 1,
  fontSize: 16,
});
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
  padding: "9px 16px",
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
const filterBtn = {
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "9px 14px",
  fontSize: 13,
  cursor: "pointer",
  color: "#374151",
};
const closeBtn = {
  background: "none",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  color: "#6b7280",
  padding: "0 4px",
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