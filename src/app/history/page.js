"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  FiSearch,
  FiSmile,
  FiPaperclip,
  FiSend,
  FiPhone,
  FiMoreVertical,
  FiUser,
  FiFile,
  FiImage,
  FiX,
  FiInfo,
  FiTag,
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";

/* ─────────────────────────────────────────────
   Skeleton primitive
───────────────────────────────────────────── */
const shimmerCSS = `
@keyframes hp-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

function Skeleton({ width = "100%", height = 14, radius = 6, style = {} }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#e9edef",
        borderRadius: radius,
        width,
        height,
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.62) 50%, transparent 100%)",
          animation: "hp-shimmer 1.6s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Skeleton panels
───────────────────────────────────────────── */

// Shared top header bar
function PanelHeader({ center = false, rightCount = 2 }) {
  return (
    <div
      className="d-flex align-items-center justify-content-between px-3 border-bottom flex-shrink-0"
      style={{ height: 59, background: "#f0f2f5" }}
    >
      {center ? (
        <Skeleton width={120} height={14} />
      ) : (
        <div className="d-flex align-items-center gap-3">
          <Skeleton width={40} height={40} radius={999} />
          <Skeleton width={70} height={13} />
        </div>
      )}
      <div className="d-flex gap-2">
        {[...Array(rightCount)].map((_, i) => (
          <Skeleton key={i} width={30} height={30} radius={999} />
        ))}
      </div>
    </div>
  );
}

// Left panel — history list
function LeftPanelSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 380,
        minWidth: 380,
        height: "100%",
        overflow: "hidden",
        background: "#fff",
        borderRight: "1px solid #dee2e6",
      }}
    >
      <PanelHeader />

      {/* search */}
      <div style={{ padding: "8px", borderBottom: "1px solid #dee2e6", flexShrink: 0 }}>
        <Skeleton height={36} radius={8} />
      </div>

      {/* list rows */}
      <div style={{ flex: 1, overflowY: "hidden" }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderBottom: "1px solid #f0f2f5",
            }}
          >
            <Skeleton width={49} height={49} radius={999} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Skeleton width="48%" height={13} />
                <Skeleton width={38} height={11} />
              </div>
              <Skeleton width="72%" height={11} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Center panel — chat window
function CenterPanelSkeleton() {
  const bubbles = [
    { side: "left",  w: "52%" },
    { side: "right", w: "40%" },
    { side: "left",  w: "65%" },
    { side: "right", w: "33%" },
    { side: "left",  w: "48%" },
    { side: "right", w: "58%" },
    { side: "right", w: "28%" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
        overflow: "hidden",
        minWidth: 0,
        backgroundColor: "#efeae2",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: 59,
          background: "#f0f2f5",
          borderBottom: "1px solid #dee2e6",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Skeleton width={40} height={40} radius={999} />
          <div>
            <Skeleton width={100} height={13} style={{ marginBottom: 6 }} />
            <Skeleton width={70} height={10} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} width={30} height={30} radius={999} />
          ))}
        </div>
      </div>

      {/* bubbles */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "16px 24px",
          overflowY: "hidden",
        }}
      >
        {bubbles.map((b, i) => (
          <div
            key={i}
            style={{ display: "flex", justifyContent: b.side === "right" ? "flex-end" : "flex-start" }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: b.side === "right" ? "#c8f0be" : "#e4e6e8",
                borderRadius: b.side === "right" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                width: b.w,
                height: 42,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                  animation: "hp-shimmer 1.6s ease-in-out infinite",
                  animationDelay: `${i * 0.09}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* composer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: "#f0f2f5",
          borderTop: "1px solid #dee2e6",
          flexShrink: 0,
        }}
      >
        <Skeleton width={40} height={40} radius={999} />
        <Skeleton width={40} height={40} radius={999} />
        <Skeleton height={42} radius={8} />
        <Skeleton width={42} height={42} radius={999} />
      </div>
    </div>
  );
}

// Right panel — contact info
function RightPanelSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 340,
        minWidth: 340,
        height: "100%",
        overflow: "hidden",
        background: "#fff",
        borderLeft: "1px solid #dee2e6",
      }}
    >
      <PanelHeader center rightCount={0} />

      <div style={{ flex: 1, background: "#f7f8fa", overflowY: "hidden" }}>
        {/* avatar block */}
        <div style={{ background: "#fff", textAlign: "center", padding: "24px 16px", borderBottom: "10px solid #f0f2f5" }}>
          <Skeleton width={92} height={92} radius={999} style={{ margin: "0 auto 14px" }} />
          <Skeleton width={140} height={15} radius={6} style={{ margin: "0 auto 10px" }} />
          <Skeleton width={110} height={12} radius={6} style={{ margin: "0 auto" }} />
        </div>

        {/* detail cards */}
        {[
          { label: "Basic Info", rows: 2 },
          { label: "Tag",        rows: 1 },
          { label: "Activity",   rows: 2 },
        ].map((card, ci) => (
          <div key={ci} style={{ background: "#fff", marginBottom: 8, padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Skeleton width={16} height={16} radius={4} />
              <Skeleton width={80} height={13} />
            </div>
            {[...Array(card.rows)].map((_, ri) => (
              <div key={ri} style={{ marginBottom: 12 }}>
                <Skeleton width={50} height={10} style={{ marginBottom: 6 }} />
                <Skeleton width="82%" height={13} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Full skeleton — all three panels side by side, covering the whole shell
function HistorySkeleton() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden" }}>
      <LeftPanelSkeleton />
      <CenterPanelSkeleton />
      <RightPanelSkeleton />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Real data
───────────────────────────────────────────── */
const historyData = [
  { id: 1, name: "PRAHLAD UDAY",   initial: "P", color: "#ff5c35", status: "SYSTEM: Utility Message Sent",             phone: "+91 9876543210", email: "prahlad@example.com",  tag: "Utility",     lastSeen: "online" },
  { id: 2, name: "HITESH BHAIYA",  initial: "H", color: "#b98b00", status: "SYSTEM: Unsupported message received",     phone: "+91 9123456780", email: "unknown1@example.com", tag: "Unsupported", lastSeen: "last seen today at 09:15 AM" },
  { id: 3, name: "RAHUL",          initial: "R", color: "#ff4d4f", status: "SYSTEM: Marketing Lite Message Sent",      phone: "+91 9345678912", email: "marble@example.com",   tag: "Marketing",   lastSeen: "last seen yesterday at 08:40 PM" },
  { id: 4, name: "NAVEEN KUNWAL",  initial: "N", color: "#7c3aed", status: "SYSTEM: Conversation Started",             phone: "+91 9988776655", email: "naveen@example.com",   tag: "Customer",    lastSeen: "last seen today at 11:45 AM" },
  { id: 5, name: "VIVEK",          initial: "V", color: "#ff5c35", status: "SYSTEM: Marketing Lite Message Sent",      phone: "+91 9000011111", email: "unknown2@example.com", tag: "Marketing",   lastSeen: "last seen yesterday at 06:22 PM" },
  { id: 6, name: "PRIYANKA MAM",   initial: "P", color: "#00a3bf", status: "SYSTEM: Unsupported message received",     phone: "+91 9888888888", email: "unknown3@example.com", tag: "Unsupported", lastSeen: "last seen yesterday at 04:10 PM" },
  { id: 7, name: "COFFEE",         initial: "C", color: "#9ca300", status: "SYSTEM: Unsupported message received",     phone: "+91 9777777777", email: "unknown4@example.com", tag: "Unsupported", lastSeen: "last seen 2 days ago" },
  { id: 8, name: "KAPIL VAISHNAV", initial: "K", color: "#4f46e5", status: "SYSTEM: Utility Message Sent",             phone: "+91 9876501234", email: "kapil@example.com",    tag: "Admin",       lastSeen: "last seen today at 12:05 PM" },
];

const emojiList = [
  "😀","😁","😂","🤣","😊","😍","😘","😎","🤩","😭",
  "😡","👍","👏","🙏","🔥","🎉","❤️","💯","👌","✨",
];

const initialMessages = {
  1: [
    { id: 1, type: "received", messageType: "text", text: "SYSTEM: Utility Message Sent",          time: "10:30 AM" },
    { id: 2, type: "sent",     messageType: "text", text: "Message delivered successfully.",        time: "10:31 AM", delivered: true, seen: true },
  ],
  2: [{ id: 3, type: "received", messageType: "text", text: "SYSTEM: Unsupported message received",  time: "09:15 AM" }],
  3: [{ id: 4, type: "received", messageType: "text", text: "SYSTEM: Marketing Lite Message Sent",   time: "08:40 PM" }],
  4: [{ id: 5, type: "received", messageType: "text", text: "SYSTEM: Conversation Started",          time: "11:45 AM" }],
  5: [{ id: 6, type: "received", messageType: "text", text: "SYSTEM: Marketing Lite Message Sent",   time: "06:22 PM" }],
  6: [{ id: 7, type: "received", messageType: "text", text: "SYSTEM: Unsupported message received",  time: "04:10 PM" }],
  7: [{ id: 8, type: "received", messageType: "text", text: "SYSTEM: Unsupported message received",  time: "02:10 PM" }],
  8: [{ id: 9, type: "received", messageType: "text", text: "SYSTEM: Utility Message Sent",          time: "12:05 PM" }],
};

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function HistoryPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetch — replace with your real data call
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const [search,              setSearch]              = useState("");
  const [selectedChat,        setSelectedChat]        = useState(historyData[0]);
  const [messages,            setMessages]            = useState(initialMessages);
  const [input,               setInput]               = useState("");
  const [showEmojiPicker,     setShowEmojiPicker]     = useState(false);
  const [attachmentMenuOpen,  setAttachmentMenuOpen]  = useState(false);
  const [pendingAttachment,   setPendingAttachment]   = useState(null);
  const [mobileChatOpen,      setMobileChatOpen]      = useState(false);
  const [isMobile,            setIsMobile]            = useState(false);

  const pageRef        = useRef(null);
  const leftPanelRef   = useRef(null);
  const centerPanelRef = useRef(null);
  const rightPanelRef  = useRef(null);
  const messageScrollRef = useRef(null);
  const fileInputRef   = useRef(null);
  const imageInputRef  = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 820);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // GSAP entrance fires only after skeleton is replaced
  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(leftPanelRef.current,   { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(centerPanelRef.current, { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, delay: 0.08, ease: "power3.out" });
      if (rightPanelRef.current)
        gsap.fromTo(rightPanelRef.current, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, delay: 0.14, ease: "power3.out" });
      gsap.from(".wa-history-item", { opacity: 0, y: 14, stagger: 0.05, duration: 0.25, ease: "power2.out" });
    }, pageRef);
    return () => ctx.revert();
  }, [isLoading, search, isMobile]);

  useEffect(() => {
    if (messageScrollRef.current)
      messageScrollRef.current.scrollTop = messageScrollRef.current.scrollHeight;
  }, [messages, selectedChat, pendingAttachment]);

  const filteredHistory = useMemo(() => {
    const value = search.toLowerCase();
    return historyData.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.phone.toLowerCase().includes(value) ||
        item.status.toLowerCase().includes(value)
    );
  }, [search]);

  const getTimeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSend = () => {
    if (!selectedChat || (!input.trim() && !pendingAttachment)) return;
    const now = Date.now();
    const outgoing = [];

    if (input.trim())
      outgoing.push({ id: now, type: "sent", messageType: "text", text: input.trim(), time: getTimeNow(), delivered: true, seen: false });

    if (pendingAttachment)
      outgoing.push({ id: now + 1, type: "sent", messageType: pendingAttachment.kind, fileName: pendingAttachment.fileName, fileSize: pendingAttachment.fileSize, url: pendingAttachment.url, time: getTimeNow(), delivered: true, seen: false });

    setMessages((prev) => ({ ...prev, [selectedChat.id]: [...(prev[selectedChat.id] || []), ...outgoing] }));
    setInput("");
    setPendingAttachment(null);
    setShowEmojiPicker(false);
    setAttachmentMenuOpen(false);

    setTimeout(() => {
      setMessages((prev) => ({ ...prev, [selectedChat.id]: (prev[selectedChat.id] || []).map((m) => m.type === "sent" ? { ...m, seen: true } : m) }));
    }, 900);
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAttachment({ kind: "image", fileName: file.name, fileSize: formatFileSize(file.size), url: URL.createObjectURL(file) });
    setAttachmentMenuOpen(false);
    e.target.value = "";
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    setPendingAttachment({ kind: isImage ? "image" : "file", fileName: file.name, fileSize: formatFileSize(file.size), url: URL.createObjectURL(file) });
    setAttachmentMenuOpen(false);
    e.target.value = "";
  };

  const lastPreview = (chatId, fallback) => {
    const last = messages[chatId]?.[messages[chatId].length - 1];
    if (!last) return fallback;
    if (last.messageType === "image") return "📷 Photo";
    if (last.messageType === "file")  return `📎 ${last.fileName}`;
    return last.text;
  };

  const lastTime = (chatId) => messages[chatId]?.[messages[chatId].length - 1]?.time || "";

  return (
    <>
      <style jsx global>{`
        html, body { height: 100%; overflow: hidden; }

        .sticky-history-shell {
          position: fixed;
          top: 70px; left: 88px; right: 0; bottom: 0;
          overflow: hidden;
          background: #f0f2f5;
        }

        .scroll-hidden {
          overflow-y: auto; overflow-x: hidden;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .scroll-hidden::-webkit-scrollbar { display: none; }

        .history-chat-bg {
          background-color: #efeae2;
          background-image: radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .icon-btn:hover   { background: #e9edef !important; }
        .wa-history-item:hover { background: #f5f6f6 !important; }
        .emoji-btn:hover, .attach-btn:hover { background: #f0f2f5 !important; }
        .send-btn:hover   { transform: scale(1.04); }

        @media (max-width: 820px) {
          .sticky-history-shell { top: 60px; left: 0; }
        }
      `}</style>

      <style>{shimmerCSS}</style>

      <div ref={pageRef} className="sticky-history-shell p-4">
        <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />
        <input ref={fileInputRef}  type="file"                  hidden onChange={handleFilePick} />

        {/* Single top-level container — always full width + height */}
        <div style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden" }}>
          {isLoading ? (
            <HistorySkeleton />
          ) : (
            <>
              {/* ── LEFT PANEL ── */}
              {(!isMobile || !mobileChatOpen) && (
                <aside
                  ref={leftPanelRef}
                  className="d-flex flex-column bg-white border-end"
                  style={{
                    width:    isMobile ? "100%" : "380px",
                    minWidth: isMobile ? "100%" : "380px",
                    height: "100%", minHeight: 0, overflow: "hidden",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between px-3 border-bottom flex-shrink-0"
                    style={{ height: 59, background: "#f0f2f5" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: 40, height: 40, background: "#dfe5e7", color: "#54656f" }}>H</div>
                      <div className="fw-semibold" style={{ color: "#111b21", fontSize: "0.96rem" }}>History</div>
                    </div>
                    <div className="d-flex gap-1">
                      <HeaderIcon icon={<FiSearch size={18} />} />
                      <HeaderIcon icon={<FiMoreVertical size={18} />} />
                    </div>
                  </div>

                  <div className="p-2 border-bottom flex-shrink-0 bg-white">
                    <div className="d-flex align-items-center gap-2 px-3"
                      style={{ height: 36, borderRadius: 8, background: "#f0f2f5" }}>
                      <FiSearch size={15} color="#54656f" />
                      <input type="text" placeholder="Search history" value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control border-0 shadow-none bg-transparent p-0"
                        style={{ fontSize: "0.9rem", color: "#111b21" }} />
                    </div>
                  </div>

                  <div className="flex-grow-1 scroll-hidden bg-white" style={{ minHeight: 0 }}>
                    {filteredHistory.map((item) => (
                      <button key={item.id} type="button"
                        onClick={() => {
                          setSelectedChat(item);
                          if (isMobile) setMobileChatOpen(true);
                          setShowEmojiPicker(false);
                          setAttachmentMenuOpen(false);
                          setPendingAttachment(null);
                        }}
                        className="wa-history-item w-100 border-0 text-start d-flex align-items-center gap-3 px-3 py-3"
                        style={{ background: selectedChat?.id === item.id ? "#f0f2f5" : "#ffffff", borderBottom: "1px solid #f0f2f5" }}>
                        <ChatAvatar text={item.initial} color={item.color} />
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="d-flex align-items-center justify-content-between gap-2">
                            <div className="text-truncate" style={{ fontSize: "0.96rem", fontWeight: 500, color: "#111b21", textTransform: "capitalize" }}>
                              {item.name}
                            </div>
                            <div className="flex-shrink-0" style={{ fontSize: "0.72rem", color: "#667781" }}>
                              {lastTime(item.id)}
                            </div>
                          </div>
                          <div className="text-truncate mt-1" style={{ fontSize: "0.84rem", color: "#667781" }}>
                            {lastPreview(item.id, item.status)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </aside>
              )}

              {/* ── CENTER PANEL ── */}
              {(!isMobile || mobileChatOpen) && (
                <main
                  ref={centerPanelRef}
                  className="d-flex flex-column history-chat-bg"
                  style={{ flex: 1, height: "100%", minHeight: 0, overflow: "hidden", minWidth: 0 }}
                >
                  {!selectedChat ? (
                    <EmptyState />
                  ) : (
                    <>
                      <div className="d-flex align-items-center justify-content-between px-3 border-bottom flex-shrink-0"
                        style={{ height: 59, background: "#f0f2f5" }}>
                        <div className="d-flex align-items-center gap-3 overflow-hidden">
                          {isMobile && (
                            <button type="button" className="btn btn-sm border-0 shadow-none p-1"
                              onClick={() => setMobileChatOpen(false)} style={{ color: "#54656f" }}>
                              <FiArrowLeft size={20} />
                            </button>
                          )}
                          <ChatAvatar text={selectedChat.initial} color={selectedChat.color} small />
                          <div className="overflow-hidden">
                            <div className="text-truncate" style={{ fontSize: "0.96rem", fontWeight: 500, color: "#111b21" }}>
                              {selectedChat.name}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "#667781" }}>{selectedChat.lastSeen}</div>
                          </div>
                        </div>
                        <div className="d-flex gap-1 flex-shrink-0">
                          <HeaderIcon icon={<FiSearch size={18} />} />
                          <HeaderIcon icon={<FiPhone size={18} />} />
                          <HeaderIcon icon={<FiMoreVertical size={18} />} />
                        </div>
                      </div>

                      <div ref={messageScrollRef}
                        className="flex-grow-1 scroll-hidden d-flex flex-column gap-2 px-3 px-md-4 py-3"
                        style={{ minHeight: 0 }}>
                        {(messages[selectedChat.id] || []).map((msg) => (
                          <MessageBubble key={msg.id} msg={msg} />
                        ))}
                      </div>

                      {pendingAttachment && (
                        <div className="p-2 border-top flex-shrink-0" style={{ background: "#f0f2f5" }}>
                          <div className="position-relative d-flex align-items-center gap-3 p-2 bg-white border rounded" style={{ minHeight: 96 }}>
                            <button type="button" onClick={() => setPendingAttachment(null)}
                              className="btn btn-sm rounded-circle position-absolute border-0"
                              style={{ top: 8, right: 8, width: 28, height: 28, background: "#f0f2f5" }}>
                              <FiX size={14} />
                            </button>
                            {pendingAttachment.kind === "image" ? (
                              <img src={pendingAttachment.url} alt={pendingAttachment.fileName}
                                style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                            ) : (
                              <div className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
                                style={{ width: 76, height: 76, background: "#f0f2f5" }}>
                                <FiFile size={28} color="#54656f" />
                              </div>
                            )}
                            <div className="overflow-hidden">
                              <div className="fw-semibold pe-4 text-break" style={{ color: "#111b21" }}>{pendingAttachment.fileName}</div>
                              <div className="mt-1" style={{ fontSize: "0.82rem", color: "#667781" }}>{pendingAttachment.fileSize}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="d-flex align-items-center gap-2 p-2 p-md-3 border-top position-relative flex-shrink-0"
                        style={{ background: "#f0f2f5" }}>
                        <div className="position-relative">
                          <InputIcon icon={<FiSmile size={20} />}
                            onClick={() => { setShowEmojiPicker((p) => !p); setAttachmentMenuOpen(false); }} />
                          {showEmojiPicker && (
                            <div className="position-absolute bg-white border rounded shadow p-2"
                              style={{ bottom: 54, left: 0, width: 280, zIndex: 30 }}>
                              <div className="row g-2">
                                {emojiList.map((emoji) => (
                                  <div className="col-2" key={emoji}>
                                    <button type="button" onClick={() => setInput((p) => p + emoji)}
                                      className="emoji-btn btn w-100 border-0"
                                      style={{ height: 40, fontSize: "1.15rem", background: "transparent" }}>
                                      {emoji}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="position-relative">
                          <InputIcon icon={<FiPaperclip size={20} />}
                            onClick={() => { setAttachmentMenuOpen((p) => !p); setShowEmojiPicker(false); }} />
                          {attachmentMenuOpen && (
                            <div className="position-absolute bg-white border rounded shadow p-2"
                              style={{ bottom: 54, left: 0, width: 190, zIndex: 30 }}>
                              <button type="button" onClick={() => imageInputRef.current?.click()}
                                className="attach-btn btn w-100 text-start border-0 d-flex align-items-center gap-2 mb-1"
                                style={{ background: "transparent" }}>
                                <FiImage size={16} /> Photo
                              </button>
                              <button type="button" onClick={() => fileInputRef.current?.click()}
                                className="attach-btn btn w-100 text-start border-0 d-flex align-items-center gap-2"
                                style={{ background: "transparent" }}>
                                <FiFile size={16} /> Document
                              </button>
                            </div>
                          )}
                        </div>

                        <input type="text" value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSend()}
                          placeholder="Type a message"
                          className="form-control border-0 shadow-none"
                          style={{ height: 42, borderRadius: 8, background: "#ffffff", color: "#111b21" }} />

                        <button type="button" onClick={handleSend}
                          className="send-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 42, height: 42, background: "#00a884", color: "#ffffff", flexShrink: 0, transition: "transform 0.2s ease" }}>
                          <FiSend size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </main>
              )}

              {/* ── RIGHT PANEL ── */}
              {!isMobile && (
                <section
                  ref={rightPanelRef}
                  className="d-none d-xl-flex flex-column border-start bg-white"
                  style={{ width: "340px", minWidth: "340px", height: "100%", minHeight: 0, overflow: "hidden" }}
                >
                  <div className="d-flex align-items-center justify-content-center border-bottom flex-shrink-0 fw-semibold"
                    style={{ height: 59, background: "#f0f2f5", color: "#111b21" }}>
                    Contact info
                  </div>

                  <div className="flex-grow-1 scroll-hidden" style={{ minHeight: 0, background: "#f7f8fa" }}>
                    {selectedChat ? (
                      <>
                        <div className="bg-white text-center px-3 py-4" style={{ borderBottom: "10px solid #f0f2f5" }}>
                          <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold"
                            style={{ width: 92, height: 92, background: "#dfe5e7", color: selectedChat.color, fontSize: "1.8rem" }}>
                            {selectedChat.initial}
                          </div>
                          <div style={{ fontSize: "1.08rem", fontWeight: 500, color: "#111b21" }}>{selectedChat.name}</div>
                          <div style={{ fontSize: "0.84rem", color: "#667781", marginTop: 4 }}>{selectedChat.phone}</div>
                        </div>
                        <DetailCard icon={<FiInfo size={16} />}  title="Basic Info" items={[{ label: "Phone", value: selectedChat.phone }, { label: "Email", value: selectedChat.email }]} />
                        <DetailCard icon={<FiTag size={16} />}   title="Tag"        items={[{ label: "Lead Tag", value: selectedChat.tag }]} />
                        <DetailCard icon={<FiClock size={16} />} title="Activity"   items={[{ label: "Last Seen", value: selectedChat.lastSeen }, { label: "Status", value: selectedChat.status }]} />
                      </>
                    ) : (
                      <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center" style={{ color: "#94a3b8" }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                          style={{ width: 72, height: 72, background: "#f8fafc" }}>
                          <FiUser size={28} />
                        </div>
                        No chat selected
                      </div>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Sub-components (unchanged)
───────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-4" style={{ color: "#667781" }}>
      <div style={{ width: "320px", maxWidth: "100%", padding: "30px 24px", background: "rgba(255,255,255,0.65)", borderRadius: "14px", border: "1px solid rgba(17,27,33,0.06)" }}>
        <h2 style={{ margin: "0 0 10px", fontSize: "1.3rem", color: "#111b21", fontWeight: 600 }}>WhatsApp style history panel</h2>
        <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.6 }}>Select any conversation from the left side to view chat history.</p>
      </div>
    </div>
  );
}

function ChatAvatar({ text, color, small = false }) {
  const size = small ? 40 : 49;
  return (
    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
      style={{ width: size, height: size, background: "#dfe5e7", color: color || "#54656f", fontSize: small ? "0.95rem" : "1rem" }}>
      {text}
    </div>
  );
}

function HeaderIcon({ icon }) {
  return (
    <button type="button" className="icon-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center"
      style={{ width: 38, height: 38, background: "transparent", color: "#54656f" }}>
      {icon}
    </button>
  );
}

function InputIcon({ icon, onClick }) {
  return (
    <button type="button" onClick={onClick} className="icon-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center"
      style={{ width: 40, height: 40, background: "transparent", color: "#54656f", flexShrink: 0 }}>
      {icon}
    </button>
  );
}

function MessageBubble({ msg }) {
  const bubbleBase = {
    alignSelf: msg.type === "sent" ? "flex-end" : "flex-start",
    maxWidth: "65%",
    background: msg.type === "sent" ? "#d9fdd3" : "#ffffff",
    color: "#111b21",
    padding: "6px 8px 6px 10px",
    borderRadius: msg.type === "sent" ? "7.5px 7.5px 0 7.5px" : "7.5px 7.5px 7.5px 0",
    boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
    wordBreak: "break-word",
  };

  if (msg.messageType === "image") return (
    <div style={bubbleBase}>
      <img src={msg.url} alt={msg.fileName || "image"} style={{ width: "240px", maxWidth: "100%", borderRadius: "6px", display: "block" }} />
      <div style={{ fontSize: "0.82rem", marginTop: "6px", color: "#111b21" }}>{msg.fileName}</div>
      <MessageMeta msg={msg} />
    </div>
  );

  if (msg.messageType === "file") return (
    <div style={bubbleBase}>
      <div className="d-flex align-items-center gap-2" style={{ minWidth: 220 }}>
        <div className="d-flex align-items-center justify-content-center rounded flex-shrink-0" style={{ width: 44, height: 44, background: "#f0f2f5" }}>
          <FiFile size={20} color="#54656f" />
        </div>
        <div className="overflow-hidden">
          <div className="text-break" style={{ fontWeight: 500, color: "#111b21", fontSize: "0.88rem" }}>{msg.fileName}</div>
          <div style={{ marginTop: 2, fontSize: "0.76rem", color: "#667781" }}>{msg.fileSize}</div>
        </div>
      </div>
      <MessageMeta msg={msg} />
    </div>
  );

  return (
    <div style={bubbleBase}>
      <div style={{ fontSize: "0.9rem", lineHeight: 1.42, paddingRight: "44px" }}>{msg.text}</div>
      <MessageMeta msg={msg} inline />
    </div>
  );
}

function MessageMeta({ msg, inline = false }) {
  return (
    <div className="d-flex justify-content-end align-items-center gap-1"
      style={{ marginTop: inline ? "-2px" : "5px", fontSize: "0.68rem", color: "#667781" }}>
      <span>{msg.time}</span>
      {msg.type === "sent" && (
        msg.seen ? (
          <span style={{ color: "#53bdeb", display: "flex", alignItems: "center" }}><FiCheckCircle size={12} /></span>
        ) : msg.delivered ? (
          <span style={{ display: "flex", alignItems: "center" }}>
            <FiCheck size={12} /><FiCheck size={12} style={{ marginLeft: "-5px" }} />
          </span>
        ) : null
      )}
    </div>
  );
}

function DetailCard({ icon, title, items = [] }) {
  return (
    <div className="bg-white mb-2 px-3 py-3">
      <div className="d-flex align-items-center gap-2 mb-3 fw-semibold" style={{ color: "#008069", fontSize: "0.92rem" }}>
        {icon}{title}
      </div>
      <div className="d-grid gap-3">
        {items.map((item, i) => (
          <div key={i}>
            <div style={{ fontSize: "0.76rem", color: "#667781", marginBottom: 4 }}>{item.label}</div>
            <div className="text-break" style={{ fontSize: "0.9rem", color: "#111b21", fontWeight: 500 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}
