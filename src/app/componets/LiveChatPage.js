  "use client";
  import { getSocket } from "../lib/socket";



import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
  import { gsap } from "gsap";
  import { AnimatePresence, motion } from "framer-motion";
  import {
    FiPhone,
    FiSearch,
    FiMoreVertical,
    FiSmile,
    FiSend,
    FiTag,
    FiInfo,
    FiMessageSquare,
    FiFile,
    FiImage,
    FiX,
    FiCheck,
    FiCheckCircle,
    FiArrowLeft,
    FiPlus,
    FiCamera,
    FiHeadphones,
    FiUser,
    FiCalendar,
    FiUsers,
    FiTrash2,
    FiChevronDown,
  FiShare2,
  FiCopy,
  FiCheckSquare,
  } from "react-icons/fi";

  const BASE =
  process.env.NEXT_PUBLIC_BACKEND ||
  "https://whatsapp-backend-production-308a.up.railway.app";

const API_BASE = `${BASE}/api`;

  /* ─────────────────────────────────────────────
    Skeleton components (unchanged)
  ───────────────────────────────────────────── */
  const shimmerCSS = `
  @keyframes lc-shimmer {
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
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
            animation: "lc-shimmer 1.6s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  function HeaderSkeleton({ wide = false }) {
    return (
      <div
        className="d-flex align-items-center justify-content-between px-3 border-bottom flex-shrink-0"
        style={{ height: 59, background: "#f0f2f5" }}
      >
        <div className="d-flex align-items-center gap-3">
          <Skeleton width={40} height={40} radius={999} />
          {wide && <Skeleton width={80} height={14} />}
        </div>
        <div className="d-flex gap-2">
          <Skeleton width={30} height={30} radius={999} />
          <Skeleton width={30} height={30} radius={999} />
          {wide && <Skeleton width={30} height={30} radius={999} />}
        </div>
      </div>
    );
  }

  function ChatListSkeleton() {
    return (
      <div
        className="d-flex flex-column bg-white border-end"
        style={{ width: 380, minWidth: 380, height: "100%", overflow: "hidden" }}
      >
        <HeaderSkeleton />
        <div className="p-2 border-bottom bg-white flex-shrink-0">
          <Skeleton height={36} radius={8} />
        </div>
        <div className="d-flex gap-2 p-2 border-bottom bg-white flex-shrink-0">
          {[110, 130, 130].map((w, i) => (
            <Skeleton key={i} width={w} height={32} radius={999} />
          ))}
        </div>
        <div className="flex-grow-1" style={{ overflowY: "hidden" }}>
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="d-flex align-items-center gap-3 px-3 py-3"
              style={{ borderBottom: "1px solid #f0f2f5" }}
            >
              <Skeleton width={49} height={49} radius={999} style={{ flexShrink: 0 }} />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between mb-2">
                  <Skeleton width="50%" height={13} />
                  <Skeleton width={40} height={11} />
                </div>
                <Skeleton width="75%" height={11} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ChatWindowSkeleton() {
    const bubbles = [
      { side: "left",  w: "55%" },
      { side: "right", w: "42%" },
      { side: "left",  w: "68%" },
      { side: "right", w: "35%" },
      { side: "left",  w: "50%" },
      { side: "right", w: "60%" },
      { side: "right", w: "30%" },
    ];
    return (
      <div
        className="d-flex flex-column chat-bg"
        style={{ flex: 1, height: "100%", overflow: "hidden", minWidth: 0 }}
      >
        <HeaderSkeleton wide />
        <div
          className="flex-grow-1 d-flex flex-column gap-3 px-4 py-4"
          style={{ overflowY: "hidden" }}
        >
          {bubbles.map((b, i) => (
            <div
              key={i}
              className="d-flex"
              style={{ justifyContent: b.side === "right" ? "flex-end" : "flex-start" }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: b.side === "right" ? "#d1f5c9" : "#e9edef",
                  borderRadius: b.side === "right" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                  width: b.w,
                  height: 42,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                    animation: "lc-shimmer 1.6s ease-in-out infinite",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className="d-flex align-items-center gap-2 p-3 border-top flex-shrink-0"
          style={{ background: "#f0f2f5" }}
        >
          <Skeleton width={42} height={42} radius={999} />
          <Skeleton width={42} height={42} radius={999} />
          <Skeleton height={42} radius={24} />
          <Skeleton width={42} height={42} radius={999} />
        </div>
      </div>
    );
  }

  function ContactInfoSkeleton() {
    return (
      <div
        className="d-flex flex-column border-start bg-white"
        style={{ width: 340, minWidth: 340, height: "100%", overflow: "hidden" }}
      >
        <div
          className="d-flex align-items-center justify-content-center border-bottom flex-shrink-0"
          style={{ height: 59, background: "#f0f2f5" }}
        >
          <Skeleton width={120} height={14} />
        </div>
        <div className="flex-grow-1" style={{ background: "#f7f8fa", overflowY: "hidden" }}>
          <div className="bg-white text-center px-3 py-4" style={{ borderBottom: "10px solid #f0f2f5" }}>
            <Skeleton width={92} height={92} radius={999} style={{ margin: "0 auto 16px" }} />
            <Skeleton width={140} height={16} radius={6} style={{ margin: "0 auto 10px" }} />
            <Skeleton width={110} height={12} radius={6} style={{ margin: "0 auto" }} />
          </div>
          {["Basic Info", "Lead Tag", "Notes"].map((section, si) => (
            <div key={si} className="bg-white mb-2 px-3 py-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Skeleton width={16} height={16} radius={4} />
                <Skeleton width={80} height={13} />
              </div>
              {[...Array(si === 0 ? 4 : 1)].map((_, i) => (
                <div key={i} className="mb-3">
                  <Skeleton width={50} height={10} style={{ marginBottom: 6 }} />
                  <Skeleton width="80%" height={13} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function LiveChatSkeleton() {
    return (
      <div style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden" }}>
        <ChatListSkeleton />
        <ChatWindowSkeleton />
        <ContactInfoSkeleton />
      </div>
    );
  }

  /* ─────────────────────────────────────────────
    Constants
  ───────────────────────────────────────────── */
  const emojiList = [
    "😀","😁","😂","🤣","😊","😍","😘","😎","🤩","😭",
    "😡","👍","👏","🙏","🔥","🎉","❤️","💯","👌","✨",
  ];

  const attachmentItems = [
    { id: "document", label: "Document",        icon: FiFile,          color: "#6c63ff" },
    { id: "photos",   label: "Photos & videos", icon: FiImage,         color: "#3b82f6" },
    { id: "camera",   label: "Camera",          icon: FiCamera,        color: "#ec4899" },
    { id: "audio",    label: "Audio",           icon: FiHeadphones,    color: "#f97316" },
    { id: "contact",  label: "Contact",         icon: FiUser,          color: "#0ea5e9" },
    { id: "poll",     label: "Poll",            icon: FiMessageSquare, color: "#f59e0b" },
    { id: "event",    label: "Event",           icon: FiCalendar,      color: "#ef4444" },
    { id: "sticker",  label: "New sticker",     icon: FiPlus,          color: "#10b981" },
  ];

  const popupVariants = {
    hidden:  { opacity: 0, y: 12, scale: 0.96 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } },
  };

  /* ─────────────────────────────────────────────
    Main component
  ───────────────────────────────────────────── */
  export default function LiveChatPage() {

    // ── 1. ALL useState ──────────────────────────
    const [isLoading,          setIsLoading]          = useState(true);
    const [activeTab,          setActiveTab]          = useState("active");
    const [chatList,           setChatList]           = useState([]);
    const [selectedChat,       setSelectedChat]       = useState(null);
    const [contacts,           setContacts]           = useState([]);
    const [tags, setTags] = useState([]);
    const [messages,           setMessages]           = useState({});
    const [input,              setInput]              = useState("");
    const [search,             setSearch]             = useState("");
    const [showEmojiPicker,    setShowEmojiPicker]    = useState(false);
    const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
    const [pendingAttachment,  setPendingAttachment]  = useState(null);
    const [mobileChatOpen,     setMobileChatOpen]     = useState(false);
    const [isMobile,           setIsMobile]           = useState(false);
    const [isUserTyping,       setIsUserTyping]       = useState(false);
    const [typingTimeout,      setTypingTimeout]      = useState(null);
    const [showContacts,       setShowContacts]       = useState(false);
    const [currentUser,        setCurrentUser]        = useState(null);
    const [showGroupModal,     setShowGroupModal]     = useState(false);
    const [groupName,          setGroupName]          = useState("");
    const [selectedContactsForGroup, setSelectedContactsForGroup] = useState([]);
    const [showDeleteModal,    setShowDeleteModal]    = useState(false);
    const [selectedMessageId,  setSelectedMessageId]  = useState(null);
    const [showForwardModal, setShowForwardModal] = useState(false);
const [forwardMessage,   setForwardMessage]   = useState(null);

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(user);
    }, []);

    // ── 2. ALL useRef ─────────────────────────────
    const pageRef           = useRef(null);
    const listPanelRef      = useRef(null);
    const centerPanelRef    = useRef(null);
    const rightPanelRef     = useRef(null);
    const messageScrollRef  = useRef(null);
    const fileInputRef      = useRef(null);
    const imageInputRef     = useRef(null);
    const attachmentWrapRef = useRef(null);
    const emojiWrapRef      = useRef(null);
    const currentUserRef    = useRef(null);

    useEffect(() => {
      currentUserRef.current = currentUser;
    }, [currentUser]);

    // ── 3. ALL useEffect ──────────────────────────
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 820);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      fetch(`${BACKEND}/api/contacts`)
        .then(res => res.json())
        .then(data => setContacts(data))
        .catch(console.error);
    }, []);

    useEffect(() => {
  fetch(`${BACKEND}/api/tags`)
    .then(res => res.json())
    .then(data => setTags(Array.isArray(data) ? data : data.tags || data.data || [])) 
    .catch(console.error);
}, []);

    useEffect(() => {
    const s = getSocket();
    s.connect();

    // 🔥 Join personal room with user's phone number
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.phone) {
      s.emit("joinUserRoom", user.phone);
    }

    return () => s.disconnect();
  }, []);

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
      fetch(`${BACKEND}/api/chats/${user.phone}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setChatList(data);
            if (data.length > 0) setSelectedChat(data[0]);
          } else {
            console.error("Chat list is not an array:", data);
            setChatList([]);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
    if (!selectedChat) return;

    const chatId = selectedChat._id;
    const s = getSocket();

    s.emit("joinChat", chatId);

    // ✅ FETCH MESSAGES
    fetch(`${BACKEND}/api/messages?chatId=${chatId}&userPhone=${currentUser?.phone}`)
      .then(r => r.json())
      .then(data => {
        setMessages(prev => ({
          ...prev,
          [chatId]: data.map(m => {
            const isSentByMe =
    String(m.sender) === String(currentUserRef.current?.phone);

            return {
              id: m._id,
              sender: m.sender,

              type: isSentByMe ? "sent" : "received",

              messageType: m.messageType || "text",
              text: m.text || "",

              templateMeta: m.templateMeta || null,

              createdAt: m.createdAt,

              time: new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),

              delivered: m.status === "delivered" || m.status === "seen",
              seen: m.status === "seen",

              fileName: m.fileName,
              url: m.fileUrl,

              isDeleted: m.isDeleted || false,
            };
          }),
        }));
      })
      .catch(console.error);

    // ✅ MARK READ
    if (currentUser) {
      fetch(`${BACKEND}/api/messages/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, userPhone: currentUser.phone }),
      }).catch(console.error);

      s.emit("markRead", { chatId, userPhone: currentUser.phone });
    }

    // 🔥 NEW MESSAGE HANDLER
    const handleNewMessage = (msg) => {
      if (String(msg.chatId) !== String(chatId)) return;

      const isSentByMe =
    String(msg.sender) === String(currentUserRef.current?.phone);

      setMessages(prev => {
        const currentMsgs = prev[chatId] || [];

        // 🔁 Replace optimistic temp message
        const tempIndex = currentMsgs.findIndex(m =>
          m.id && String(m.id).startsWith("tmp-") &&
          m.text === msg.text &&
          Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 5000
        );

        if (tempIndex !== -1) {
          const updatedMsgs = [...currentMsgs];

          updatedMsgs[tempIndex] = {
            id: msg._id,
            sender: msg.sender,

            type: isSentByMe ? "sent" : "received", // ✅ FIX

            messageType: msg.messageType || "text",
            text: msg.text || "",

            templateMeta: msg.templateMeta || null,

            createdAt: msg.createdAt,

            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),

            delivered: false,
            seen: false,

            fileName: msg.fileName,
            url: msg.fileUrl,

            isDeleted: false,
          };

          return { ...prev, [chatId]: updatedMsgs };
        }

        // ➕ Add new message normally
        if (currentMsgs.some(m => m.id === msg._id)) return prev;

        const newMsg = {
          id: msg._id,
          sender: msg.sender,

          type: isSentByMe ? "sent" : "received",

          messageType: msg.messageType || "text",
          text: msg.text || "",

          templateMeta: msg.templateMeta || null,

          createdAt: msg.createdAt,

          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),

          delivered: !isSentByMe,
          seen: false,

          fileName: msg.fileName,
          url: msg.fileUrl,

          isDeleted: false,
        };

        return { ...prev, [chatId]: [...currentMsgs, newMsg] };
      });
    };

    

    // ✅ MESSAGE DELIVERED
    const handleMessageDelivered = ({ messageId, chatId: deliveredChatId }) => {
      if (String(deliveredChatId) !== String(chatId)) return;

      setMessages(prev => {
        const updated = { ...prev };
        const chatMessages = updated[chatId];

        if (chatMessages) {
          updated[chatId] = chatMessages.map(msg =>
            msg.id === messageId ? { ...msg, delivered: true } : msg
          );
        }

        return updated;
      });
    };

    // ✅ MESSAGES SEEN
    const handleMessagesSeen = ({ chatId: seenChatId, user }) => {
      if (String(seenChatId) !== String(chatId)) return;

      setMessages(prev => {
        const updated = { ...prev };
        const chatMessages = updated[chatId];

        if (chatMessages) {
          updated[chatId] = chatMessages.map(msg => {
            if (msg.type === "sent" && msg.sender !== user) {
              return { ...msg, seen: true, delivered: true };
            }
            return msg;
          });
        }

        return updated;
      });
    };

    // ✅ TYPING
    const handleUserTyping = ({ chatId: typingChatId }) => {
      if (String(typingChatId) === String(chatId)) {
        setIsUserTyping(true);
        setTimeout(() => setIsUserTyping(false), 1500);
      }
    };

    // ✅ CHAT DELETED
    const handleChatDeleted = ({ chatId: deletedChatId, userPhone }) => {
      if (userPhone === currentUser?.phone) {
        setChatList(prev => prev.filter(chat => chat._id !== deletedChatId));
        if (selectedChat?._id === deletedChatId) setSelectedChat(null);
      }
    };

    // ✅ MESSAGE DELETED (EVERYONE)
    const handleMessageDeletedForEveryone = ({ messageId, chatId: deletedMsgChatId }) => {
      if (String(deletedMsgChatId) !== String(chatId)) return;

      setMessages(prev => {
        const updated = { ...prev };
        const chatMessages = updated[chatId];

        if (chatMessages) {
          updated[chatId] = chatMessages.map(msg =>
            msg.id === messageId
              ? {
                  ...msg,
                  isDeleted: true,
                  text: "This message was deleted",
                  fileUrl: null,
                  fileName: null,
                  fileSize: null,
                }
              : msg
          );
        }

        return updated;
      });
    };

    // ✅ MESSAGE DELETED (ME)
    const handleMessageDeletedForMe = ({ messageId, chatId: deletedMsgChatId, userPhone }) => {
      if (userPhone !== currentUser?.phone) return;
      if (String(deletedMsgChatId) !== String(chatId)) return;

      setMessages(prev => {
        const updated = { ...prev };
        const chatMessages = updated[chatId];

        if (chatMessages) {
          updated[chatId] = chatMessages.filter(msg => msg.id !== messageId);
        }

        return updated;
      });
    };

    // 🔗 SOCKET EVENTS
    s.on("newMessage", handleNewMessage);
    s.on("messageDelivered", handleMessageDelivered);
    s.on("messagesSeen", handleMessagesSeen);
    s.on("userTyping", handleUserTyping);
    s.on("chatDeleted", handleChatDeleted);
    s.on("messageDeletedForEveryone", handleMessageDeletedForEveryone);
    s.on("messageDeletedForMe", handleMessageDeletedForMe);

    return () => {
      s.off("newMessage", handleNewMessage);
      s.off("messageDelivered", handleMessageDelivered);
      s.off("messagesSeen", handleMessagesSeen);
      s.off("userTyping", handleUserTyping);
      s.off("chatDeleted", handleChatDeleted);
      s.off("messageDeletedForEveryone", handleMessageDeletedForEveryone);
      s.off("messageDeletedForMe", handleMessageDeletedForMe);
    };

  }, [selectedChat, currentUser]);

    useEffect(() => {
      if (messageScrollRef.current)
        messageScrollRef.current.scrollTop = messageScrollRef.current.scrollHeight;
    }, [messages, selectedChat, pendingAttachment]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (attachmentWrapRef.current && !attachmentWrapRef.current.contains(e.target))
          setAttachmentMenuOpen(false);
        if (emojiWrapRef.current && !emojiWrapRef.current.contains(e.target))
          setShowEmojiPicker(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── 4. useMemo ────────────────────────────────
    const tabs = useMemo(() => {
      if (!Array.isArray(chatList)) return [];
      const count = (s) => chatList.filter((c) => c.status === s).length;
      return [
        { id: "active", label: "ACTIVE", count: count("active") },
        { id: "requesting", label: "REQUESTING", count: count("requesting") },
        { id: "intervened", label: "INTERVENED", count: count("intervened") },
      ];
    }, [chatList]);

    const searchSuggestions = useMemo(() => {
  if (!search.trim() || showContacts) return [];
  return contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile?.includes(search)
  ).slice(0, 5);
}, [search, contacts, showContacts]);

    const filteredChats = useMemo(() => {
      if (!Array.isArray(chatList)) return [];
      return chatList
        .filter((c) => c.status === activeTab)
        .filter((c) => {
          const v = search.toLowerCase();
          return (
            (c.name  || "").toLowerCase().includes(v) ||
            (c.phone || "").toLowerCase().includes(v) ||
            (c.email || "").toLowerCase().includes(v)
          );
        });
    }, [activeTab, chatList, search]);

    useLayoutEffect(() => {
      if (isLoading) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.35 } });
        if (listPanelRef.current)   tl.fromTo(listPanelRef.current,   { opacity: 0, x: -12 }, { opacity: 1, x: 0 });
        if (centerPanelRef.current) tl.fromTo(centerPanelRef.current, { opacity: 0, y: 10  }, { opacity: 1, y: 0  }, "-=0.2");
        if (rightPanelRef.current)  tl.fromTo(rightPanelRef.current,  { opacity: 0, x: 12  }, { opacity: 1, x: 0  }, "-=0.2");
      }, pageRef);
      return () => ctx.revert();
    }, [isLoading]);

    // ── 6. Handlers ───────────────────────────────
    const getTimeNow = () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const handleSelectChat = (chat) => {
      setSelectedChat(chat);
      if (isMobile) setMobileChatOpen(true);
      setShowEmojiPicker(false);
      setAttachmentMenuOpen(false);
      setPendingAttachment(null);
      setChatList((prev) =>
        prev.map((item) => item._id === chat._id ? { ...item, unread: 0 } : item)
      );
    };

    const handleDeleteChat = async (chatId) => {
      if (!confirm("Delete this chat for yourself? The other person will still see it.")) return;
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await fetch(`${BACKEND}/api/chats/${chatId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userPhone: user.phone }),
        });
        if (res.ok) {
          setChatList(prev => prev.filter(chat => chat._id !== chatId));
          if (selectedChat?._id === chatId) setSelectedChat(null);
        } else {
          alert("Failed to delete chat");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting chat");
      }
    };

    const handleForwardMessage = (msg) => {
  setForwardMessage(msg);
  setShowForwardModal(true);
};

const sendForward = async (targetChat) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!forwardMessage || !targetChat) return;

  const payload = {
    chatId: targetChat._id,
    sender: user.phone,
    messageType: forwardMessage.messageType,
    text: forwardMessage.text || "",
    fileUrl: forwardMessage.url || null,
    fileName: forwardMessage.fileName || null,
    templateMeta: forwardMessage.templateMeta || null,
  };

  await fetch(`${API_BASE}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(console.error);

  setShowForwardModal(false);
  setForwardMessage(null);
  setSelectedChat(targetChat);
};

    // ----- Message deletion handlers -----
    const openDeleteModal = (messageId) => {
      setSelectedMessageId(messageId);
      setShowDeleteModal(true);
    };

    const deleteForMe = async () => {
      if (!selectedMessageId) return;
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await fetch(`${BACKEND}/api/messages/${selectedMessageId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userPhone: user.phone, mode: "me" }),
        });
        if (res.ok) {
          // Remove message from local state
          setMessages(prev => {
            const updated = { ...prev };
            const chatId = selectedChat._id;
            if (updated[chatId]) {
              updated[chatId] = updated[chatId].filter(msg => msg.id !== selectedMessageId);
            }
            return updated;
          });
          setShowDeleteModal(false);
          setSelectedMessageId(null);
        } else {
          alert("Failed to delete message for yourself");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting message");
      }
    };

    const deleteForEveryone = async () => {
      if (!selectedMessageId) return;
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await fetch(`${BACKEND}/api/messages/${selectedMessageId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userPhone: user.phone, mode: "everyone" }),
        });
        if (res.ok) {
          // Update local message to show deleted placeholder
          setMessages(prev => {
            const updated = { ...prev };
            const chatId = selectedChat._id;
            if (updated[chatId]) {
              updated[chatId] = updated[chatId].map(msg =>
                msg.id === selectedMessageId
                  ? { ...msg, isDeleted: true, text: "This message was deleted", fileUrl: null, fileName: null }
                  : msg
              );
            }
            return updated;
          });
          setShowDeleteModal(false);
          setSelectedMessageId(null);
        } else {
          alert("Failed to delete message for everyone");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting message");
      }
    };

    const handleTabChange = (tabId) => {
      setActiveTab(tabId);
      const next = chatList.filter((c) => c.status === tabId);
      setSelectedChat(next[0] || null);
      setMobileChatOpen(false);
      setShowEmojiPicker(false);
      setAttachmentMenuOpen(false);
      setPendingAttachment(null);
    };

    const startChatWithContact = async (contact) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!contact.mobile) return;
      try {
        const res = await fetch(`${BACKEND}/api/chats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderPhone: user.phone,
            receiverPhone: contact.mobile,
          }),
        });
        const chat = await res.json();
        if (!chat._id) throw new Error("Chat creation failed");
        setChatList(prev => (Array.isArray(prev) ? [chat, ...prev] : [chat]));
        setSelectedChat(chat);
        setShowContacts(false);
        if (isMobile) setMobileChatOpen(true);
        setSearch("");
      } catch (err) {
        console.error(err);
        alert("Could not create chat with this contact.");
      }
    };

    const deleteContact = async (contactId, contactName) => {
      if (!confirm(`Delete "${contactName}" from contacts?`)) return;
      try {
        const res = await fetch(`${BACKEND}/api/contacts/${contactId}`, { method: "DELETE" });
        if (res.ok) {
          setContacts(prev => prev.filter(c => c._id !== contactId));
        } else {
          alert("Failed to delete contact");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting contact");
      }
    };

    const createGroup = async () => {
      if (!groupName.trim() || selectedContactsForGroup.length === 0) {
        alert("Please enter a group name and select at least one contact");
        return;
      }
      const user = JSON.parse(localStorage.getItem("user"));
      const participants = [user.phone, ...selectedContactsForGroup.map(c => c.mobile)];
      try {
        const res = await fetch(`${BACKEND}/api/groups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupName, participants, admin: user.phone }),
        });
        const newGroup = await res.json();
        if (!newGroup._id) throw new Error("Group creation failed");
        setChatList(prev => [newGroup, ...prev]);
        setSelectedChat(newGroup);
        setShowGroupModal(false);
        setGroupName("");
        setSelectedContactsForGroup([]);
        if (isMobile) setMobileChatOpen(true);
      } catch (err) {
        console.error(err);
        alert("Failed to create group. Make sure your backend has the /api/groups endpoint.");
      }
    };

    const handleSearchUser = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!search.trim()) return;

      let receiverPhone = search.trim();
      const matchedContact = contacts.find(
        (c) =>
          c.name?.toLowerCase() === search.trim().toLowerCase() ||
          c.mobile === search.trim()
      );
      if (matchedContact) {
        receiverPhone = matchedContact.mobile;
      }

      if (!/^[0-9+\-\s()]+$/.test(receiverPhone)) {
        alert("Please enter a valid phone number or contact name");
        return;
      }

      try {
        const res = await fetch(`${BACKEND}/api/chats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderPhone: user.phone,
            receiverPhone: receiverPhone,
          }),
        });
        const chat = await res.json();
        if (!chat._id) throw new Error("Chat creation failed");

        setChatList((prev) => {
          if (!Array.isArray(prev)) return [chat];
          const exists = prev.find((c) => c._id === chat._id);
          return exists ? prev : [chat, ...prev];
        });
        setSelectedChat(chat);
        setSearch("");
      } catch (err) {
        console.error(err);
        alert("User not found or error creating chat. Make sure the phone number exists.");
      }
    };

    const uploadFile = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${BACKEND}/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      return await res.json();
    };

    const handleSend = async () => {
      if (!selectedChat || (!input.trim() && !pendingAttachment)) return;
      const chatId = selectedChat._id;
      const user = JSON.parse(localStorage.getItem("user"));

      const sendMessage = async (textToSend, attachmentData = null) => {
        let messageData = {
          chatId,
          sender: user.phone,
          text: textToSend || "",
          messageType: "text",
        };
        if (attachmentData) {
          messageData = {
            ...messageData,
            messageType: attachmentData.messageType,
            fileUrl: attachmentData.fileUrl,
            fileName: attachmentData.fileName,
            fileSize: attachmentData.fileSize,
            text: "",
          };
        }
        await fetch(`${API_BASE}/api/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
        }).catch(console.error);
      };

      if (pendingAttachment) {
        const pa = pendingAttachment;
        setPendingAttachment(null);
        if (pa.url && pa.url.startsWith("blob:")) {
          try {
            const blob = await fetch(pa.url).then(r => r.blob());
            const file = new File([blob], pa.fileName, { type: blob.type });
            const uploadData = await uploadFile(file);
            await sendMessage("", {
              messageType: uploadData.messageType,
              fileUrl: uploadData.fileUrl,
              fileName: uploadData.fileName,
              fileSize: uploadData.fileSize,
            });
          } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload file");
          }
        } else {
          await sendMessage("", {
            messageType: pa.kind,
            fileUrl: pa.url,
            fileName: pa.fileName,
            fileSize: pa.fileSize,
          });
        }
      }

      if (input.trim()) {
        const text = input.trim();
        setInput("");
        setMessages(prev => ({
          ...prev,
          [chatId]: [
            ...(prev[chatId] || []),
            {
  id: `tmp-${Date.now()}`,
  type: "sent",
  messageType: "text",
  text,
  time: getTimeNow(),
  createdAt: new Date().toISOString(),
  delivered: false,
  seen: false,
},
          ],
        }));
        await sendMessage(text);
      }

      setShowEmojiPicker(false);
      setAttachmentMenuOpen(false);
    };

    const sendTemplate = async (template) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Convert variables Map to plain object
    let variables = {};
    if (template.variables) {
      try {
        variables = template.variables instanceof Map
          ? Object.fromEntries(template.variables)
          : typeof template.variables === "object"
            ? Object.fromEntries(Object.entries(template.variables))
            : {};
      } catch (e) {
        variables = {};
      }
    }

    const payload = {
      chatId: selectedChat._id,
      sender: user.phone,
      messageType: "template",
      templateMeta: {
        // ✅ FIX 1: try all possible ID fields
        templateId: template._id || template.id || null,

        header:    template.name    || "",
        footer:    template.footer  || "",
        mediaType: template.mediaType || "None",
        mediaUrl:  template.imageFile?.url  ||
                  template.imageFile?.path ||
                  template.videoFile?.url  ||
                  template.videoFile?.path || null,
        body:      template.format  || "",
        variables,

        actions: {
          // ✅ FIX 2: map title→label, value→url correctly
          ctaButtons: (template.ctaButtons || []).map(btn => ({
            id:      btn.id,
            label:   btn.title  || btn.label || "",
            url:     btn.value  || btn.url   || "",
            btnType: btn.btnType || "",
          })),

          quickReplies: (template.quickReplies || []).map(r => ({
            id:    r.id,
            title: r.title || r.label || "",
          })),

          copyCodeButtons: (template.copyCodeButtons || []).map(btn => ({
            id:    btn.id,
            label: btn.title || btn.label || "",
            value: btn.value || btn.code  || "",
          })),

          // ✅ FIX 3: dropdownButtons and inputFields were not being mapped
          dropdownButtons: (template.dropdownButtons || []).map(dd => ({
            id:          dd.id,
            title:       dd.title       || "",
            placeholder: dd.placeholder || "",
            options:     dd.options     || "",
            parsedOptions: dd.parsedOptions || [],
            selected:    dd.selected    || "",
          })),

          inputFields: (template.inputFields || []).map(f => ({
            id:          f.id,
            label:       f.label       || "",
            placeholder: f.placeholder || "",
            value:       f.value       || "",
          })),
        },

        carouselItems: (template.carouselItems || []),
      },
    };

    console.log("SENDING PAYLOAD:", JSON.stringify(payload, null, 2)); // verify before removing
    await fetch(`${API_BASE}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };  

    const handleImagePick = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setPendingAttachment({
        kind: "image", fileName: file.name,
        fileSize: formatFileSize(file.size), url: URL.createObjectURL(file),
      });
      setAttachmentMenuOpen(false);
      e.target.value = "";
    };

    const handleFilePick = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const isImage = file.type.startsWith("image/");
      setPendingAttachment({
        kind: isImage ? "image" : "file", fileName: file.name,
        fileSize: formatFileSize(file.size), url: URL.createObjectURL(file),
      });
      setAttachmentMenuOpen(false);
      e.target.value = "";
    };

    const handleAttachmentAction = (type) => {
      if (type === "photos")   { imageInputRef.current?.click(); return; }
      if (type === "document") { fileInputRef.current?.click();  return; }
      setAttachmentMenuOpen(false);
    };

    const handleInputChange = (e) => {
      setInput(e.target.value);
      if (selectedChat && currentUser) {
        const s = getSocket();
        s.emit("typing", { chatId: selectedChat._id, user: currentUser.name });
        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => {}, 1000));
      }
    };

    const lastMessageText = (chatId) => {
      const last = messages[chatId]?.[messages[chatId].length - 1];
      if (!last) return "Start conversation";
      if (last.messageType === "image") return "📷 Photo";
      if (last.messageType === "file")  return `📎 ${last.fileName}`;
      return last.text;
    };

    const lastMessageTime = (chatId) =>
      messages[chatId]?.[messages[chatId].length - 1]?.time || "";

    // ── 7. JSX ────────────────────────────────────
    return (
      <>
        <style>{`
          html, body { height: 100%; overflow: hidden; }
          .sticky-chat-shell {
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
          .chat-bg {
            background-color: #efeae2;
            background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px);
            background-size: 28px 28px;
          }
          .icon-btn, .chat-item, .send-btn, .tab-pill,
          .composer-action-btn, .attach-row-btn, .emoji-chip {
            will-change: transform, opacity;
            backface-visibility: hidden;
            transform: translateZ(0);
          }
          .icon-btn { transition: background 0.18s ease, transform 0.18s ease; }
          .icon-btn:hover { background: #e9edef !important; }
          .chat-item { transition: background 0.18s ease; }
          .chat-item:hover { background: #f5f6f6 !important; }
          .send-btn { transition: transform 0.18s ease, box-shadow 0.18s ease; }
          .send-btn:hover { transform: scale(1.03); box-shadow: 0 10px 22px rgba(0,168,132,0.2); }
          .tab-pill {
            border: none; white-space: nowrap;
            font-size: 0.78rem; font-weight: 700;
            background: #f0f2f5; color: #54656f;
            transition: background 0.2s ease, color 0.2s ease;
          }
          .tab-pill.active-tab { background: #d9fdd3 !important; color: #005c4b !important; }
          .msg-enter { animation: msgIn 0.22s ease both; }
          .composer-action-btn {
            width: 42px; height: 42px;
            border: none; outline: none;
            border-radius: 50%; background: transparent; color: #54656f;
            display: flex; align-items: center; justify-content: center;
            transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
            flex-shrink: 0;
          }
          .composer-action-btn:hover { background: #e9edef; }
          .composer-action-btn.active { background: #e7fef5; color: #00a884; }
          .attach-sheet {
            position: absolute; left: 0; bottom: 56px;
            width: 250px; background: #ffffff;
            border-radius: 18px; box-shadow: 0 16px 45px rgba(17,27,33,0.16);
            border: 1px solid rgba(17,27,33,0.06);
            padding: 12px 10px; z-index: 40;
          }
          .attach-row-btn {
            width: 100%; border: none; background: transparent;
            display: flex; align-items: center; gap: 14px;
            padding: 11px 12px; border-radius: 12px; text-align: left;
            transition: background 0.18s ease, transform 0.18s ease;
          }
          .attach-row-btn:hover { background: #f7f8fa; }
          .attach-icon-box {
            width: 28px; height: 28px; border-radius: 999px;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          }
          .emoji-panel {
            position: absolute; left: 0; bottom: 56px;
            width: 280px; background: #ffffff;
            border-radius: 18px; box-shadow: 0 16px 45px rgba(17,27,33,0.16);
            border: 1px solid rgba(17,27,33,0.06);
            padding: 12px; z-index: 40;
          }
          .emoji-chip {
            width: 100%; height: 40px; border: none;
            background: transparent; border-radius: 10px; font-size: 1.15rem;
            transition: background 0.16s ease, transform 0.16s ease;
          }
          .emoji-chip:hover { background: #f5f6f6; transform: translateY(-1px); }
          @keyframes msgIn {
            from { opacity: 0; transform: translateY(8px) scale(0.988); }
            to   { opacity: 1; transform: translateY(0)  scale(1); }
          }
          @media (max-width: 820px) {
            .sticky-chat-shell { top: 60px; left: 0; }
            .attach-sheet { width: 220px; }
            .emoji-panel  { width: 250px; }
          }
        `}</style>
        <style>{shimmerCSS}</style>

        <div ref={pageRef} className="sticky-chat-shell p-3">
          <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />
          <input ref={fileInputRef}  type="file"                  hidden onChange={handleFilePick} />

          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            {isLoading ? (
              <LiveChatSkeleton />
            ) : (
              <>
                {/* LEFT PANEL (unchanged) */}
                {(!isMobile || !mobileChatOpen) && (
                  <div
                    ref={listPanelRef}
                    className="d-flex flex-column bg-white border-end"
                    style={{ width: isMobile ? "100%" : "380px", minWidth: isMobile ? "100%" : "380px", height: "100%", minHeight: 0, overflow: "hidden" }}
                  >
                    <div className="d-flex align-items-center justify-content-between px-3 border-bottom flex-shrink-0" style={{ height: 59, background: "#f0f2f5" }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40, background: "#dfe5e7", color: "#54656f" }}>K</div>
                        <div className="fw-semibold" style={{ color: "#111b21" }}>
                          <button onClick={() => setShowContacts(false)} className="btn btn-sm p-0 me-2" style={{ fontWeight: !showContacts ? 'bold' : 'normal', color: !showContacts ? '#111b21' : '#54656f', background: 'none', border: 'none' }}>Chats</button>
                          <span style={{ color: '#54656f' }}>|</span>
                          <button onClick={() => setShowContacts(true)} className="btn btn-sm p-0 ms-2" style={{ fontWeight: showContacts ? 'bold' : 'normal', color: showContacts ? '#111b21' : '#54656f', background: 'none', border: 'none' }}>Contacts</button>
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        <button type="button" onClick={() => setShowGroupModal(true)} className="icon-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 38, height: 38, background: "transparent", color: "#54656f" }}><FiUsers size={18} /></button>
                        <HeaderIcon icon={<FiMoreVertical size={18} />} />
                      </div>
                    </div>

                    <div className="p-2 border-bottom flex-shrink-0 bg-white" style={{ position: "relative" }}>
  <div className="d-flex align-items-center gap-2 px-3" style={{ height: 36, borderRadius: 8, background: "#f0f2f5" }}>
    <FiSearch size={15} color="#54656f" />
    <input type="text" placeholder={showContacts ? "Search contacts..." : "Search or start new chat"} value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !showContacts) handleSearchUser(); }} style={{ flex: 1, background: "transparent", border: "none", outline: "none" }} />
    {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#54656f", cursor: "pointer", padding: 0 }}><FiX size={14} /></button>}
  </div>
  {searchSuggestions.length > 0 && (
    <div style={{ position: "absolute", top: "100%", left: 8, right: 8, background: "#fff", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", border: "1px solid #e9edef", zIndex: 999, overflow: "hidden" }}>
      {searchSuggestions.map(contact => (
        <div
          key={contact._id || contact.mobile}
          onClick={() => { startChatWithContact(contact); setSearch(""); }}
          className="d-flex align-items-center gap-3 px-3 py-2"
          style={{ cursor: "pointer", borderBottom: "1px solid #f0f2f5" }}
          onMouseEnter={e => e.currentTarget.style.background = "#f5f6f6"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: 36, height: 36, background: "#dfe5e7", color: "#54656f", fontSize: "0.9rem" }}>
            {contact.name?.charAt(0) || "C"}
          </div>
          <div>
            <div style={{ fontSize: "0.92rem", fontWeight: 500, color: "#111b21" }}>{contact.name}</div>
            <div style={{ fontSize: "0.78rem", color: "#667781" }}>{contact.mobile}</div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

                    {!showContacts && (
                      <div className="d-flex gap-2 p-2 border-bottom bg-white flex-shrink-0 scroll-hidden">
                        {tabs.map((tab) => (
                          <button key={tab.id} type="button" onClick={() => handleTabChange(tab.id)} className={`btn rounded-pill px-3 py-2 tab-pill ${activeTab === tab.id ? "active-tab" : ""}`}>{tab.label} ({tab.count})</button>
                        ))}
                      </div>
                    )}

                    <div className="flex-grow-1 scroll-hidden" style={{ minHeight: 0, background: "#fff" }}>
                      {showContacts ? (
                        contacts.length === 0 ? (
                          <div className="text-center p-4" style={{ color: "#667781" }}>No contacts found</div>
                        ) : (
                          contacts
                            .filter((contact) =>
                              search
                                ? (contact.name?.toLowerCase().includes(search.toLowerCase()) ||
                                  contact.mobile?.includes(search))
                                : true
                            )
                            .map((contact) => (
                              <div
                                key={contact._id || contact.mobile}
                                className="chat-item w-100 border-0 d-flex align-items-center gap-3 px-3 py-3"
                                style={{ borderBottom: "1px solid #f0f2f5", cursor: "pointer" }}
                              >
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                  style={{ width: 49, height: 49, background: "#dfe5e7", color: "#54656f" }}
                                  onClick={() => startChatWithContact(contact)}
                                >
                                  {contact.name?.charAt(0) || "C"}
                                </div>
                                <div
                                  className="flex-grow-1 overflow-hidden"
                                  onClick={() => startChatWithContact(contact)}
                                >
                                  <div className="text-truncate" style={{ fontSize: "0.98rem", fontWeight: 500, color: "#111b21" }}>
                                    {contact.name}
                                  </div>
                                  <div className="text-truncate" style={{ fontSize: "0.84rem", color: "#667781" }}>
                                    {contact.mobile}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContact(contact._id, contact.name);
                                  }}
                                  className="btn btn-sm p-1"
                                  style={{ color: "#dc3545", background: "transparent", border: "none" }}
                                  title="Delete contact"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            ))
                        )
                      ) : (
                        filteredChats.length === 0 ? (
                          <div className="text-center p-4" style={{ color: "#667781" }}>No chats found</div>
                        ) : (
                          filteredChats.map((item) => (
                            <div
                              key={item._id}
                              className="chat-item w-100 border-0 d-flex align-items-center gap-3 px-3 py-3"
                              style={{
                                background: selectedChat?._id === item._id ? "#f0f2f5" : "#ffffff",
                                borderBottom: "1px solid #f0f2f5",
                                cursor: "pointer",
                              }}
                              onClick={() => handleSelectChat(item)}
                            >
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                style={{ width: 49, height: 49, background: "#dfe5e7", color: "#54656f" }}
                              >
                                {item.name?.charAt(0) || "U"}
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <div className="d-flex align-items-center justify-content-between gap-2">
                                  <div className="text-truncate" style={{ fontSize: "0.98rem", fontWeight: 500, color: "#111b21" }}>
                                    {item.name || item.phone}
                                  </div>
                                  <div className="flex-shrink-0" style={{ fontSize: "0.72rem", color: item.unread > 0 ? "#25d366" : "#667781" }}>
                                    {lastMessageTime(item._id)}
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between gap-2 mt-1">
                                  <div className="text-truncate" style={{ fontSize: "0.84rem", color: "#667781" }}>
                                    {lastMessageText(item._id)}
                                  </div>
                                  {item.unread > 0 && (
                                    <div
                                      className="rounded-pill d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                                      style={{ minWidth: 20, height: 20, background: "#25d366", fontSize: "0.7rem", padding: "0 6px" }}
                                    >
                                      {item.unread}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(item._id);
                                }}
                                className="btn btn-sm p-1"
                                style={{ color: "#dc3545", background: "transparent", border: "none" }}
                                title="Delete chat"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          ))
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* CENTER PANEL */}
                {(!isMobile || mobileChatOpen) && (
                  <div ref={centerPanelRef} className="d-flex flex-column chat-bg" style={{ flex: 1, height: "100%", minHeight: 0, overflow: "hidden", minWidth: 0 }}>
                    {!selectedChat ? (
                      <div className="d-flex flex-grow-1 align-items-center justify-content-center">Select a chat</div>
                    ) : (
                      <>
                        <div className="d-flex align-items-center justify-content-between px-3 border-bottom flex-shrink-0" style={{ height: 59, background: "#f0f2f5" }}>
                          <div className="d-flex align-items-center gap-3 overflow-hidden">
                            {isMobile && <button type="button" className="btn btn-sm border-0 shadow-none p-1" onClick={() => setMobileChatOpen(false)} style={{ color: "#54656f" }}><FiArrowLeft size={20} /></button>}
                            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: 40, height: 40, background: "#dfe5e7", color: "#54656f" }}>{selectedChat?.name?.charAt(0) || "U"}</div>
                            <div className="overflow-hidden">
                              <div className="text-truncate" style={{ fontSize: "0.96rem", fontWeight: 500, color: "#111b21" }}>{selectedChat?.name}</div>
                              <div style={{ fontSize: "0.78rem", color: "#667781" }}>{selectedChat.lastSeen}</div>
                            </div>
                          </div>
                          <div className="d-flex gap-1 flex-shrink-0">
                            <HeaderIcon icon={<FiSearch size={18} />} />
                            <HeaderIcon icon={<FiPhone size={18} />} />
                            <HeaderIcon icon={<FiMoreVertical size={18} />} />
                          </div>
                        </div>

                        <div ref={messageScrollRef} className="flex-grow-1 scroll-hidden d-flex flex-column gap-2 px-3 px-md-4 py-3" style={{ minHeight: 0 }}>
                          {(messages[selectedChat?._id] || []).map((msg, index) => (
                            <div
    key={msg.id}
    className="msg-enter"
    style={{
      animationDelay: `${index * 0.02}s`,
      display: "flex",
      justifyContent: msg.type === "sent" ? "flex-end" : "flex-start",
    }}
  >
    <MessageBubble msg={msg} onDeleteClick={openDeleteModal} onForward={handleForwardMessage} />
  </div>
                          ))}
                          {isUserTyping && <div className="d-flex justify-content-start"><div className="px-3 py-2 rounded-3 bg-white" style={{ fontSize: "0.8rem", color: "#667781" }}>Typing...</div></div>}
                        </div>

                        {pendingAttachment && (
                          <div className="p-2 border-top flex-shrink-0" style={{ background: "#f0f2f5" }}>
                            <div className="position-relative d-flex align-items-center gap-3 p-2 bg-white border rounded" style={{ minHeight: 96 }}>
                              <button type="button" onClick={() => setPendingAttachment(null)} className="btn btn-sm rounded-circle position-absolute border-0" style={{ top: 8, right: 8, width: 28, height: 28, background: "#f0f2f5" }}><FiX size={14} /></button>
                              {pendingAttachment.kind === "image" ? <img src={pendingAttachment.url} alt={pendingAttachment.fileName} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} /> : <div className="d-flex align-items-center justify-content-center rounded flex-shrink-0" style={{ width: 76, height: 76, background: "#f0f2f5" }}><FiFile size={28} color="#54656f" /></div>}
                              <div className="overflow-hidden">
                                <div className="fw-semibold pe-4 text-break" style={{ color: "#111b21" }}>{pendingAttachment.fileName}</div>
                                <div className="mt-1" style={{ fontSize: "0.82rem", color: "#667781" }}>{pendingAttachment.fileSize}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="d-flex align-items-center gap-2 p-2 p-md-3 border-top position-relative flex-shrink-0" style={{ background: "#f0f2f5" }}>
                          <div ref={attachmentWrapRef} className="position-relative">
                            <motion.button type="button" onClick={() => { setAttachmentMenuOpen((p) => !p); setShowEmojiPicker(false); }} className={`composer-action-btn ${attachmentMenuOpen ? "active" : ""}`} whileTap={{ scale: 0.9 }}>
                              <motion.div animate={{ rotate: attachmentMenuOpen ? 90 : 0 }} transition={{ duration: 0.18, ease: "easeOut" }}>{attachmentMenuOpen ? <FiX size={22} /> : <FiPlus size={24} />}</motion.div>
                            </motion.button>
                            <AnimatePresence>
                              {attachmentMenuOpen && (
                                <motion.div variants={popupVariants} initial="hidden" animate="visible" exit="exit" className="attach-sheet">
                                  {attachmentItems.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                      <motion.button key={item.id} type="button" onClick={() => handleAttachmentAction(item.id)} className="attach-row-btn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18, delay: index * 0.02 }} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                                        <div className="attach-icon-box" style={{ color: item.color }}><Icon size={18} /></div>
                                        <span style={{ fontSize: "0.98rem", fontWeight: 500, color: "#1f2937" }}>{item.label}</span>
                                      </motion.button>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div ref={emojiWrapRef} className="position-relative">
                            <motion.button type="button" onClick={() => { setShowEmojiPicker((p) => !p); setAttachmentMenuOpen(false); }} className={`composer-action-btn ${showEmojiPicker ? "active" : ""}`} whileTap={{ scale: 0.9 }}>
                              <motion.div animate={{ rotate: showEmojiPicker ? -8 : 0, scale: showEmojiPicker ? 1.05 : 1 }} transition={{ duration: 0.18, ease: "easeOut" }}><FiSmile size={21} /></motion.div>
                            </motion.button>
                            <AnimatePresence>
                              {showEmojiPicker && (
                                <motion.div variants={popupVariants} initial="hidden" animate="visible" exit="exit" className="emoji-panel">
                                  <div className="row g-2">
                                    {emojiList.map((emoji, index) => (
                                      <div className="col-2" key={emoji}>
                                        <motion.button type="button" onClick={() => setInput((p) => p + emoji)} className="emoji-chip" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16, delay: index * 0.008 }} whileTap={{ scale: 0.9 }}>{emoji}</motion.button>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <input type="text" value={input} onChange={handleInputChange} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Type a message" className="form-control border-0 shadow-none" style={{ height: 42, borderRadius: 24, background: "#ffffff", paddingLeft: 16, paddingRight: 16 }} />

                          <button type="button" onClick={handleSend} className="send-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, background: "#00a884", color: "#ffffff", flexShrink: 0 }}><FiSend size={18} /></button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* RIGHT PANEL (unchanged) */}
                {!isMobile && (
                  <div ref={rightPanelRef} className="d-none d-xl-flex flex-column border-start bg-white" style={{ width: "340px", minWidth: "340px", height: "100%", minHeight: 0, overflow: "hidden" }}>
                    <div className="d-flex align-items-center justify-content-center border-bottom flex-shrink-0 fw-semibold" style={{ height: 59, background: "#f0f2f5", color: "#111b21" }}>{selectedChat?.isGroup ? "Group Info" : "Contact Info"}</div>
                    <div className="flex-grow-1 scroll-hidden" style={{ minHeight: 0, background: "#f7f8fa" }}>
                      {selectedChat ? (
                        <>
                          <div className="bg-white text-center px-3 py-4" style={{ borderBottom: "10px solid #f0f2f5" }}>
                            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold" style={{ width: 92, height: 92, background: "#dfe5e7", color: "#54656f", fontSize: "1.8rem" }}>{selectedChat?.name?.charAt(0) || "U"}</div>
                            <div style={{ fontSize: "1.08rem", fontWeight: 500, color: "#111b21" }}>{selectedChat?.name}</div>
                            {!selectedChat?.isGroup && <div style={{ fontSize: "0.84rem", color: "#667781", marginTop: 4 }}>{selectedChat?.phone}</div>}
                          </div>

                          {selectedChat?.isGroup ? (
                            <DetailCard icon={<FiUsers size={16} />} title="Members" customContent={<div>{selectedChat.participants?.join(", ")}</div>} />
                          ) : (
                            <>
                              <DetailCard icon={<FiInfo size={16} />} title="Basic Info" items={[{ label: "Phone", value: selectedChat?.phone }, { label: "Email", value: selectedChat?.email }, { label: "City", value: selectedChat?.city }, { label: "Status", value: selectedChat?.lastSeen }]} />
                              <DetailCard icon={<FiTag size={16} />} title="Lead Tag" items={[{ label: "Tag", value: tags.find(t => t._id === selectedChat.tag)?.name || selectedChat.tag || "No tag" }]} />
                              <DetailCard icon={<FiMessageSquare size={16} />} title="Notes" customContent={<div style={{ fontSize: "0.9rem", color: "#3b4a54", lineHeight: 1.6 }}>{selectedChat.notes}</div>} />
                            </>
                          )}
                        </>
                      ) : (
                        <div className="text-center p-4" style={{ color: "#667781" }}>No chat selected</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Group Creation Modal (unchanged) */}
        {showGroupModal && (
          <div className="modal-overlay" onClick={() => setShowGroupModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: "white", padding: "20px", borderRadius: "12px", width: "90%", maxWidth: "400px", maxHeight: "80vh", overflowY: "auto" }}>
              <h4>Create Group</h4>
              <input type="text" placeholder="Group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="form-control mb-2" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
              <p>Select contacts:</p>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {contacts.map(contact => (
                  <label key={contact.mobile} className="d-flex align-items-center gap-2 mb-2">
                    <input type="checkbox" checked={selectedContactsForGroup.some(c => c.mobile === contact.mobile)} onChange={(e) => {
                      if (e.target.checked) setSelectedContactsForGroup([...selectedContactsForGroup, contact]);
                      else setSelectedContactsForGroup(selectedContactsForGroup.filter(c => c.mobile !== contact.mobile));
                    }} />
                    {contact.name} ({contact.mobile})
                  </label>
                ))}
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-secondary" onClick={() => setShowGroupModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={createGroup}>Create</button>
              </div>
            </div>
          </div>
        )}

        {/* Forward Message Modal */}
{showForwardModal && (
  <div
    onClick={() => setShowForwardModal(false)}
    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{ background: "#fff", borderRadius: 12, width: 360, maxHeight: "70vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e9edef", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 600, fontSize: "1rem", color: "#111b21" }}>Forward message to</span>
        <button onClick={() => setShowForwardModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#54656f" }}><FiX size={20} /></button>
      </div>

      {/* Preview of message being forwarded */}
      {forwardMessage && (
        <div style={{ margin: "10px 16px", padding: "8px 12px", background: "#f0f2f5", borderRadius: 8, fontSize: "0.85rem", color: "#54656f", borderLeft: "3px solid #00a884" }}>
          {forwardMessage.messageType === "image" ? "📷 Photo" :
           forwardMessage.messageType === "file"  ? `📎 ${forwardMessage.fileName}` :
           forwardMessage.messageType === "template" ? `📋 ${forwardMessage.templateMeta?.header || "Template"}` :
           forwardMessage.text}
        </div>
      )}

      {/* Chat list */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {chatList.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#667781" }}>No chats available</div>
        ) : (
          chatList.map(chat => (
            <div
              key={chat._id}
              onClick={() => sendForward(chat)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #f0f2f5" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f5f6f6"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#dfe5e7", color: "#54656f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                {chat.name?.charAt(0) || "U"}
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: "0.95rem", color: "#111b21" }}>{chat.name || chat.phone}</div>
                <div style={{ fontSize: "0.8rem", color: "#667781" }}>{chat.phone}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}

        {/* Delete Message Modal */}
        {showDeleteModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                width: "300px",
                textAlign: "center",
              }}
            >
              <h4>Delete message</h4>
              <p>Choose an option:</p>
              <div className="d-flex flex-column gap-2" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={deleteForMe}
                  style={{
                    padding: "8px 16px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete for me
                </button>
                <button
                  onClick={deleteForEveryone}
                  style={{
                    padding: "8px 16px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete for everyone
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: "8px 16px",
                    background: "#f8f9fa",
                    color: "#212529",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /* ─────────────────────────────────────────────
    Sub-components
  ───────────────────────────────────────────── */
  function MessageBubble({
  msg,
  onDeleteClick,
  onForward,
  onSelect,
  isSelected,
  multiSelectMode,
}) {
  const [showActions, setShowActions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const bubbleRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMine = msg.type === "sent";

  const bubbleBase = {
    alignSelf: isMine ? "flex-end" : "flex-start",
    maxWidth: "65%",
    background: isMine ? "#d9fdd3" : "#ffffff",
    color: "#111b21",
    padding: "6px 8px 6px 10px",
    borderRadius: isMine ? "7.5px 7.5px 0 7.5px" : "7.5px 7.5px 7.5px 0",
    boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
    wordBreak: "break-word",
    position: "relative",
  };

  // Deleted message placeholder
  if (msg.isDeleted) {
    return (
      <div style={bubbleBase}>
        <div style={{ fontStyle: "italic", color: "#667781", fontSize: "0.85rem" }}>
          This message was deleted
        </div>
      </div>
    );
  }

  // Copy message text to clipboard
  const handleCopy = () => {
    if (msg.messageType === "text" && msg.text) {
      navigator.clipboard.writeText(msg.text);
    }
    setShowMenu(false);
  };

  // Forward message
  const handleForward = () => {
    if (onForward) onForward(msg);
    else alert("Forward functionality not yet implemented.");
    setShowMenu(false);
  };

  // Message info
  const handleInfo = () => {
    alert(`Message sent at ${msg.time}`);
    setShowMenu(false);
  };

  // Toggle selection (multi-select)
  const handleSelectToggle = () => {
    if (onSelect) onSelect(msg.id);
    setShowMenu(false);
  };

  // Open delete modal
  const handleDeleteClick = () => {
    onDeleteClick(msg.id);
    setShowMenu(false);
  };

  // Helper: get button label regardless of which key is used
  const btnLabel = (btn) =>
    btn.label || btn.title || btn.text || btn.buttonText || "Button";

  // Helper: get button URL
  const btnUrl = (btn) => btn.url || btn.value || btn.link || null;

  // Helper: get copy value
  const btnCopyValue = (btn) => btn.value || btn.code || btn.copyCode || null;

  // Parse template variables
  const parseTemplate = (text, variables = {}) => {
    if (!text) return "";
    return text.replace(/\{\{(\d+)\}\}/g, (match, num) => {
      const varConfig = variables[num];
      if (!varConfig) return match;
      if (varConfig.type === "name") return "[Contact Name]";
      if (varConfig.type === "number") return "[Phone Number]";
      return varConfig.value || match;
    });
  };

  const renderContent = () => {
    // ─── TEMPLATE MESSAGE ──────────────────────────────────────────
    if (msg.templateMeta) {
      console.log("FULL templateMeta:", JSON.stringify(msg.templateMeta, null, 2));
      console.log("MSG templateMeta:", JSON.stringify(msg.templateMeta, null, 2));
      const t = msg.templateMeta;
      const actions = t.actions || {};

      // Parse dropdown options safely
      const dropdownsWithOptions = (actions.dropdownButtons || []).map((dd) => {
        let optionsArray = [];
        if (Array.isArray(dd.options)) {
          optionsArray = dd.options
            .map((o) => (typeof o === "object" ? o.label || o.value || "" : String(o)))
            .filter(Boolean);
        } else if (typeof dd.options === "string") {
          optionsArray = dd.options.split(",").map((o) => o.trim()).filter(Boolean);
        } else if (dd.parsedOptions) {
          optionsArray = dd.parsedOptions;
        }
        return { ...dd, optionsArray };
      });

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: 220 }}>
          {/* HEADER */}
          {t.header && (
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111b21" }}>
              {t.header}
            </div>
          )}

          {/* IMAGE */}
          {t.mediaType === "Image" && t.mediaUrl && (
            <img
              src={t.mediaUrl.startsWith("http") ? t.mediaUrl : `${BACKEND}${t.mediaUrl}`}
              alt="template"
              style={{ width: "240px", maxWidth: "100%", borderRadius: 6, display: "block" }}
            />
          )}

          {/* VIDEO */}
          {t.mediaType === "Video" && t.mediaUrl && (
            <video controls style={{ width: "240px", maxWidth: "100%", borderRadius: 6 }}>
              <source src={t.mediaUrl.startsWith("http") ? t.mediaUrl : `${BACKEND}${t.mediaUrl}`} />
            </video>
          )}

          {/* CAROUSEL */}
          {t.mediaType === "Carousel" && t.carouselItems?.length > 0 && (
            <div style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 4 }}>
              {t.carouselItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: 200,
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    padding: 8,
                    background: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {item.mediaUrl && (
                    <img
                      src={item.mediaUrl.startsWith("http") ? item.mediaUrl : `${BACKEND}${item.mediaUrl}`}
                      alt=""
                      style={{ width: "100%", borderRadius: 6, marginBottom: 6 }}
                    />
                  )}
                  {item.title && (
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.title}</div>
                  )}
                  {item.description && (
                    <div style={{ fontSize: "0.82rem", color: "#4b5563", marginTop: 2 }}>
                      {item.description}
                    </div>
                  )}
                  {item.button && (
                    <button
                      style={{
                        marginTop: 6,
                        padding: "4px 10px",
                        background: "#00a884",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "0.82rem",
                      }}
                    >
                      {item.button}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* BODY */}
          {(t.body || t.resolvedText) && (
            <div style={{ fontSize: "0.9rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {parseTemplate(t.resolvedText || t.body || "", t.variables || {})}
            </div>
          )}

          {/* FOOTER */}
          {t.footer && (
            <div style={{ fontSize: "0.78rem", color: "#667781" }}>
              {t.footer}
            </div>
          )}

          {/* DIVIDER */}
          {(
            dropdownsWithOptions.length > 0 ||
            actions.inputFields?.length > 0 ||
            actions.ctaButtons?.length > 0 ||
            actions.copyCodeButtons?.length > 0 ||
            actions.quickReplies?.length > 0
          ) && (
            <div style={{ borderTop: "1px solid #e0e0e0", marginTop: 2 }} />
          )}

          {/* DROPDOWNS */}
          {dropdownsWithOptions.map((dd, i) => (
            <div key={dd.id || i}>
              {dd.title && (
                <div style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: 4 }}>
                  {dd.title}
                </div>
              )}
              <select
                defaultValue={dd.selected || ""}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: "0.85rem",
                  background: "#fff",
                }}
              >
                <option value="">{dd.placeholder || "Select an option"}</option>
                {dd.optionsArray.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          {/* INPUT FIELDS */}
          {actions.inputFields?.map((field, i) => (
            <div key={field.id || i}>
              {field.label && (
                <div style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: 4 }}>
                  {field.label}
                </div>
              )}
              <input
                type="text"
                placeholder={field.placeholder || ""}
                defaultValue={field.value || ""}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: "0.85rem",
                  background: "#fff",
                }}
              />
            </div>
          ))}

          {/* CTA + COPY BUTTONS */}
          {(actions.ctaButtons?.length > 0 || actions.copyCodeButtons?.length > 0) && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {actions.ctaButtons?.map((btn, i) => (
                <button
                  key={btn.id || i}
                  onClick={() => {
                    const url = btnUrl(btn);
                    if (url) window.open(url, "_blank");
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: "#128C7E",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {btnLabel(btn)}
                </button>
              ))}

              {actions.copyCodeButtons?.map((btn, i) => (
                <button
                  key={btn.id || i}
                  onClick={() => {
                    const val = btnCopyValue(btn);
                    if (val) navigator.clipboard.writeText(val);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #128C7E",
                    background: "#fff",
                    color: "#128C7E",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {btnLabel(btn)}
                </button>
              ))}
            </div>
          )}

          {/* QUICK REPLIES */}
          {actions.quickReplies?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {actions.quickReplies.map((reply, i) => (
                <button
                  key={reply.id || i}
                  style={{
                    padding: "5px 14px",
                    color: "#128C7E",
                    borderRadius: 16,
                    border: "1px solid #128C7E",
                    background: "#fff",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  {btnLabel(reply)}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    // ─── IMAGE MESSAGE ─────────────────────────────────────────────
    if (msg.messageType === "image") {
      return (
        <>
          <img
            src={msg.url}
            alt={msg.fileName || "image"}
            style={{ width: "240px", maxWidth: "100%", borderRadius: 6, display: "block" }}
          />
          {msg.fileName && (
            <div style={{ fontSize: "0.78rem", color: "#667781", marginTop: 4 }}>
              {msg.fileName}
            </div>
          )}
        </>
      );
    }

    // ─── FILE MESSAGE ──────────────────────────────────────────────
    if (msg.messageType === "file") {
      return (
        <div className="d-flex align-items-center gap-2">
          <FiFile size={20} style={{ flexShrink: 0, color: "#54656f" }} />
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 500 }}>{msg.fileName}</div>
            {msg.fileSize && (
              <div style={{ fontSize: "0.75rem", color: "#667781" }}>{msg.fileSize}</div>
            )}
          </div>
        </div>
      );
    }

    // ─── TEXT MESSAGE ──────────────────────────────────────────────
    return (
      <div style={{ fontSize: "0.9rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
        {msg.text}
      </div>
    );
  };

  return (
    <div
      ref={bubbleRef}
      style={{
        ...bubbleBase,
        ...(isSelected ? { border: "2px solid #00a884", boxShadow: "0 0 0 2px rgba(0,168,132,0.2)" } : {}),
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowMenu(false);
      }}
    >
      {/* Multi-select checkbox (visible when mode is active) */}
      {multiSelectMode && (
        <div
          style={{
            position: "absolute",
            left: -24,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={handleSelectToggle}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
        </div>
      )}

      {/* Down arrow button (visible on hover) */}
      {showActions && !multiSelectMode && (
        <button
          onClick={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
const menuHeight = 160; // approximate menu height
setMenuPos({
  top: spaceBelow < menuHeight ? rect.top - menuHeight - 4 : rect.bottom + 4,
  left: rect.right - 180,
});
  setShowMenu(!showMenu);
}}
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #ddd",
            borderRadius: "50%",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#54656f",
            zIndex: 2,
          }}
        >
          <FiChevronDown size={14} />
        </button>
      )}

      {/* Dropdown menu */}
      {showMenu && createPortal(
  <div
    ref={menuRef}
    style={{
      position: "fixed",
      top: menuPos.top,
      left: menuPos.left,
zIndex: 9999,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "1px solid #e0e0e0",
            minWidth: 180,
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <MenuItem icon={<FiShare2 size={14} />} label="Forward" onClick={handleForward} />
          {msg.messageType === "text" && (
            <MenuItem icon={<FiCopy size={14} />} label="Copy" onClick={handleCopy} />
          )}
          <MenuItem icon={<FiInfo size={14} />} label="Message info" onClick={handleInfo} />
          <MenuItem
            icon={<FiTrash2 size={14} />}
            label="Delete"
            onClick={handleDeleteClick}
            danger
          />
          {multiSelectMode !== undefined && (
            <MenuItem
              icon={<FiCheckSquare size={14} />}
              label={isSelected ? "Deselect" : "Select"}
              onClick={handleSelectToggle}
            />
          )}
        </div>,
        document.body
      )}

      {/* Message content */}
      {renderContent()}
      <MessageMeta msg={msg} inline={msg.messageType === "text"} />
    </div>
  );
}

// Helper component for menu items
function MenuItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "10px 16px",
        border: "none",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: "13px",
        color: danger ? "#dc3545" : "#111b21",
        cursor: "pointer",
        textAlign: "left",
        borderBottom: "1px solid #f0f0f0",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f6f6")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

  function MessageMeta({ msg, inline = false }) {
    return (
      <div
        className="d-flex justify-content-end align-items-center gap-1"
        style={{ marginTop: inline ? "-2px" : "5px", fontSize: "0.68rem", color: "#667781" }}
      >
        <span>{msg.time}</span>
        {msg.type === "sent" && (
          <>
            {msg.seen ? (
              // Blue double tick (seen)
              <span style={{ color: "#53bdeb", display: "flex", alignItems: "center" }}>
                <FiCheckCircle size={12} />
              </span>
            ) : msg.delivered ? (
              // Grey double tick (delivered but not seen)
              <span style={{ display: "flex", alignItems: "center", gap: "-4px" }}>
                <FiCheck size={12} />
                <FiCheck size={12} style={{ marginLeft: "-5px" }} />
              </span>
            ) : (
              // Single grey tick (sent but not delivered)
              <span style={{ display: "flex", alignItems: "center" }}>
                <FiCheck size={12} />
              </span>
            )}
          </>
        )}
      </div>
    );
  }

  function HeaderIcon({ icon }) {
    return (
      <button type="button" className="icon-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 38, height: 38, background: "transparent", color: "#54656f" }}>
        {icon}
      </button>
    );
  }

  function DetailCard({ icon, title, items = [], customContent }) {
    return (
      <div className="bg-white mb-2 px-3 py-3">
        <div className="d-flex align-items-center gap-2 mb-3 fw-semibold" style={{ color: "#008069", fontSize: "0.92rem" }}>{icon}{title}</div>
        {customContent ? (
          <div>{customContent}</div>
        ) : (
          <div className="d-grid gap-3">
            {items.map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: "0.76rem", color: "#667781", marginBottom: 4 }}>{item.label}</div>
                <div className="text-break" style={{ fontSize: "0.9rem", fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function formatFileSize(bytes) {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  }