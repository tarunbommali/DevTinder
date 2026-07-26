import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams, useSearchParams, Navigate } from "react-router-dom";
import {
  Search, Edit3, Phone, Video, Info, Smile, Image as ImageIcon,
  Mic, Send, ArrowLeft, MessageCircle, Sparkles, ChevronDown, Plus,
  MoreVertical, Trash2, ShieldAlert, UserX
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BASE_URL } from "../utils/constants";
import { addConnections, removeConnectionById } from "../utils/connectionSlice";
import { createSocketConnection } from "../utils/socket";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/ui/Avatar";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { targetUserId } = useParams();
  const [searchParams] = useSearchParams();
  const targetChatId = targetUserId || searchParams.get("chat");

  const connections = useSelector((store) => store.connections || []);
  const userState = useSelector((store) => store.user || {});
  const currentUser = userState.user || (userState.firstName ? userState : null);
  const isAuthChecked = userState.isAuthChecked;

  const [selectedConnection, setSelectedConnection] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const menuRef = useRef(null);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const roomIdRef = useRef(null);

  const currentUserId = currentUser?._id;

  // Auto-close options menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDeleteChat = () => {
    setMessages([]);
    if (selectedConnection) {
      setLastMessages((prev) => ({
        ...prev,
        [selectedConnection._id]: null,
      }));
    }
    setMenuOpen(false);
    showToast("Chat history cleared");
  };

  const handleBlockUser = async () => {
    if (!selectedConnection) return;
    try {
      await axios.post(
        `${BASE_URL}/user/block/${selectedConnection._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeConnectionById(selectedConnection._id));
      showToast(`${selectedConnection.firstName} has been blocked`);
      setSelectedConnection(null);
      setMenuOpen(false);
    } catch (err) {
      console.error("Block user error:", err?.message);
      showToast("Failed to block user");
    }
  };

  const handleRemoveConnection = async () => {
    if (!selectedConnection) return;
    try {
      await axios.delete(`${BASE_URL}/connection/${selectedConnection._id}`, {
        withCredentials: true,
      });
      dispatch(removeConnectionById(selectedConnection._id));
      showToast("Connection removed");
      setSelectedConnection(null);
      setMenuOpen(false);
    } catch (err) {
      console.error("Remove connection error:", err?.message);
      showToast("Failed to remove connection");
    }
  };

  // 1. Fetch Connections
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      if (res.data?.data) {
        const conns = res.data.data;
        dispatch(addConnections(conns));

        // Fetch last message for each connection
        conns.forEach(async (connection) => {
          try {
            const msgRes = await axios.get(
              `${BASE_URL}/chat/${connection._id}/last-message`,
              { withCredentials: true }
            );
            if (msgRes.data?.data) {
              setLastMessages((prev) => ({
                ...prev,
                [connection._id]: msgRes.data.data,
              }));
            }
          } catch (err) {
            // Silence 404 for connections without messages yet
          }
        });
      }
    } catch (err) {
      console.error("Error fetching connections:", err.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Sync route param / search param with selection
  useEffect(() => {
    if (targetChatId && connections.length > 0) {
      const target = connections.find((c) => c._id === targetChatId);
      if (target && target._id !== selectedConnection?._id) {
        setSelectedConnection(target);
      }
    }
  }, [targetChatId, connections, selectedConnection?._id]);

  // 2. Load Chat & Socket Connection for Selected Connection
  useEffect(() => {
    const activeTargetId = selectedConnection?._id;
    if (!activeTargetId || !currentUserId) return;

    setMessages([]);
    setChatLoading(true);

    const connectSocket = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/chat/room/${activeTargetId}`,
          { withCredentials: true }
        );
        roomIdRef.current = res.data.roomId;

        // Fetch existing room message history if available
        try {
          const historyRes = await axios.get(
            `${BASE_URL}/chat/${activeTargetId}`,
            { withCredentials: true }
          );
          if (historyRes.data?.data) {
            setMessages(historyRes.data.data);
          }
        } catch (hErr) {
          // history endpoint optional
        }

        // Initialize Socket
        const socket = createSocketConnection();
        socketRef.current = socket;
        socket.emit("joinRoom", roomIdRef.current);

        socket.on("receiveMessage", (message) => {
          setMessages((prev) => [...prev, message]);
          setLastMessages((prev) => ({
            ...prev,
            [activeTargetId]: message,
          }));
        });
      } catch (err) {
        console.error("Failed to connect chat room", err?.message);
      } finally {
        setChatLoading(false);
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [selectedConnection?._id, currentUserId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Send Message
  const handleSend = () => {
    if (!newMessage.trim() || !socketRef.current || !roomIdRef.current || !selectedConnection)
      return;

    const message = {
      senderId: currentUserId,
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
      _id: Date.now().toString(),
    };

    socketRef.current.emit("sendMessage", {
      roomId: roomIdRef.current,
      message,
    });

    setMessages((prev) => [...prev, message]);
    setLastMessages((prev) => ({
      ...prev,
      [selectedConnection._id]: message,
    }));
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filtered connections list based on search
  const filteredConnections = connections.filter((c) => {
    const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (isAuthChecked && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-full bg-[#0B0A0A] text-[#F5EFE6] select-none flex overflow-hidden border-t border-[#2E2A27]">
      {/* ─── LEFT PANEL: CONNECTIONS SIDEBAR ─── */}
      <div
        className={`${selectedConnection ? "hidden md:flex" : "flex"
          } w-full md:w-80 lg:w-96 border-r border-[#2E2A27] flex-col bg-[#0B0A0A] shrink-0 h-full overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#2E2A27]/60">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="font-bold text-base text-[#F5EFE6] tracking-tight">
              {currentUser?.firstName?.toLowerCase() || "messages"}
            </span>
            <ChevronDown className="w-4 h-4 text-[#A79C8E]" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-[#2E2A27]/40">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-[#A79C8E] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connections..."
              className="w-full bg-[#1C1917] text-[#F5EFE6] placeholder-[#A79C8E] rounded-xl pl-10 pr-4 py-2 border border-[#2E2A27] focus:outline-none focus:border-[#C9A227] text-xs transition"
            />
          </div>
        </div>

        {/* Messages / Requests Title Header */}
        <div className="px-5 py-3 flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#F5EFE6]">Connections</h2>
          <Link
            to="/requests"
            className="text-xs font-semibold text-[#C9A227] hover:underline"
          >
            Requests
          </Link>
        </div>

        {/* Connections List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
          {filteredConnections.length === 0 ? (
            <div className="p-6 text-center text-[#A79C8E] text-xs">
              No connections found
            </div>
          ) : (
            filteredConnections.map((conn) => {
              const isSelected = selectedConnection?._id === conn._id;
              const lastMsg = lastMessages[conn._id];
              const isOwnMsg = lastMsg?.senderId === currentUserId;

              return (
                <div
                  key={conn._id}
                  onClick={() => {
                    setSelectedConnection(conn);
                    navigate(`/connections?chat=${conn._id}`, { replace: true });
                  }}
                  className={`flex items-center px-3 py-3 rounded-2xl transition-all duration-150 cursor-pointer ${isSelected
                    ? "bg-[#1C1917] border border-[#2E2A27]"
                    : "hover:bg-[#121011] border border-transparent"
                    }`}
                >
                  <Avatar
                    src={conn.profilePicture}
                    name={`${conn.firstName} ${conn.lastName || ""}`}
                    size="md"
                  />

                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-xs font-semibold truncate ${isSelected ? "text-[#C9A227]" : "text-[#F5EFE6]"
                          }`}
                      >
                        {conn.firstName} {conn.lastName || ""}
                      </h3>
                      {lastMsg?.createdAt && (
                        <span className="text-[10px] text-[#5C5650] shrink-0 ml-1">
                          {formatDistanceToNow(new Date(lastMsg.createdAt), {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#A79C8E] truncate mt-0.5">
                      {lastMsg ? (
                        <>
                          {isOwnMsg && "You: "}
                          {lastMsg.text}
                        </>
                      ) : (
                        <span className="text-[#5C5650] italic">
                          Start a conversation
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── RIGHT PANEL: ACTIVE CHAT WINDOW ─── */}
      <div
        className={`${selectedConnection ? "flex" : "hidden md:flex"
          } flex-1 flex-col bg-[#0B0A0A] h-full relative`}
      >
        {selectedConnection ? (
          <>
            {/* Top Bar */}
            <div className="px-5 py-3.5 bg-[#121011] border-b border-[#2E2A27] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                  type="button"
                  onClick={() => setSelectedConnection(null)}
                  className="md:hidden text-[#A79C8E] hover:text-[#F5EFE6] transition p-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <Avatar
                  src={selectedConnection.profilePicture}
                  name={`${selectedConnection.firstName} ${selectedConnection.lastName}`}
                  size="sm"
                />

                <div>
                  <h3 className="font-serif text-sm font-bold text-[#F5EFE6] leading-tight">
                    {selectedConnection.firstName} {selectedConnection.lastName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-[#A79C8E]">Active now</span>
                  </div>
                </div>
              </div>

              {/* 3 Dots Options Menu Button & Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  title="More Options"
                  className="p-1.5 rounded-full hover:bg-[#1C1917] text-[#A79C8E] hover:text-[#F5EFE6] transition active:scale-95 cursor-pointer"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#121011] border border-[#2E2A27] rounded-2xl shadow-2xl z-50 p-1.5 space-y-1 animate-slide-down">
                    <button
                      type="button"
                      onClick={handleDeleteChat}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5EFE6] hover:bg-[#1C1917] rounded-xl transition cursor-pointer font-medium"
                    >
                      <Trash2 className="w-4 h-4 text-[#C9A227]" />
                      Delete Chat
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveConnection}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5EFE6] hover:bg-[#1C1917] rounded-xl transition cursor-pointer font-medium"
                    >
                      <UserX className="w-4 h-4 text-amber-500" />
                      Remove Connection
                    </button>
                    <button
                      type="button"
                      onClick={handleBlockUser}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-xl transition cursor-pointer font-medium"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      Block User
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Toast Alert Banner */}
            {toastMessage && (
              <div className="bg-[#C9A227]/15 border-b border-[#C9A227]/30 text-[#C9A227] px-4 py-2 text-xs font-semibold text-center animate-slide-in shrink-0">
                {toastMessage}
              </div>
            )}

            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-3.5 bg-[#0B0A0A] flex flex-col">
              {chatLoading ? (
                <div className="flex items-center justify-center h-full text-xs text-[#A79C8E]">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="space-y-3 max-w-xs flex flex-col items-center">
                    <div className="p-1 rounded-full border-2 border-[#C9A227]/40 bg-[#C9A227]/10 shadow-lg">
                      <Avatar
                        src={selectedConnection.profilePicture}
                        name={selectedConnection.firstName}
                        size="lg"
                      />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#F5EFE6] tracking-tight">
                      {selectedConnection.firstName} {selectedConnection.lastName}
                    </h4>
                    <p className="text-xs text-[#A79C8E] leading-relaxed">
                      Connected on VYBE. Say hi and start your conversation!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 text-xs sm:text-sm shadow-md ${isOwn
                          ? "bg-[#C9A227] text-[#121011] font-medium rounded-2xl rounded-tr-xs"
                          : "bg-[#1C1917] text-[#F5EFE6] border border-[#2E2A27] rounded-2xl rounded-tl-xs"
                          }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <p
                          className={`text-[9px] mt-1 text-right font-medium ${isOwn ? "text-[#121011]/80" : "text-[#A79C8E]"
                            }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Input */}
            <div className="p-3 sm:p-4 bg-[#121011] border-t border-[#2E2A27] shrink-0">
              <div className="bg-[#1C1917] border border-[#2E2A27] rounded-full px-4 py-2 flex items-center gap-3 focus-within:border-[#C9A227] transition">
                <button type="button" className="text-[#A79C8E] hover:text-[#F5EFE6] transition cursor-pointer">
                  <Smile className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message..."
                  className="flex-1 bg-transparent text-[#F5EFE6] placeholder-[#A79C8E] focus:outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className={`font-bold text-xs transition cursor-pointer px-3.5 py-1.5 rounded-full flex items-center gap-1.5 ${newMessage.trim()
                    ? "bg-[#C9A227] text-[#121011] hover:bg-[#D9B84A] active:scale-95 shadow-md"
                    : "bg-[#2E2A27]/60 text-[#5C5650] cursor-not-allowed"
                    }`}
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty Chat View (No Connection Selected) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full border-2 border-[#C9A227]/40 bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] shadow-xl">
              <MessageCircle className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#F5EFE6]">
              Your messages
            </h2>
            <p className="text-xs text-[#A79C8E] max-w-sm leading-relaxed">
              Send private messages to your connections. Select a connection on the left panel to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;