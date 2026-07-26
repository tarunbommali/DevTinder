import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Send } from "lucide-react";
import axios from "axios";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const roomIdRef = useRef(null);

  const user = useSelector((state) => state.user);
  const userId = user?.user?._id || user?._id;

  // Fetch target user info
  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/" + targetUserId, {
          withCredentials: true,
        });
        setTargetUser(res.data?.data || res.data);
      } catch (err) {
        console.error("Failed to fetch target user", err);
      }
    };
    if (targetUserId) fetchTargetUser();
  }, [targetUserId]);

  // Socket connection
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const connectSocket = async () => {
      try {
        const res = await axios.get(BASE_URL + "/chat/room/" + targetUserId, {
          withCredentials: true,
        });
        roomIdRef.current = res.data.roomId;

        const socket = createSocketConnection();
        socketRef.current = socket;
        socket.emit("joinRoom", roomIdRef.current);

        socket.on("receiveMessage", (message) => {
          setMessages((prev) => [...prev, message]);
        });
      } catch (err) {
        console.error("Failed to get room ID", err);
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, targetUserId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !socketRef.current || !roomIdRef.current) return;

    const message = {
      senderId: userId,
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
      _id: Date.now().toString(),
    };

    socketRef.current.emit("sendMessage", { roomId: roomIdRef.current, message });
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-[82vh] bg-[#0B0A0A] text-[#F5EFE6] py-4 px-3 sm:px-6 flex flex-col items-center select-none">
      <div className="w-full max-w-2xl h-[78vh] bg-[#121011] border border-[#2E2A27] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#171415] border-b border-[#2E2A27] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {targetUser?.profilePicture ? (
              <img
                src={targetUser.profilePicture}
                alt={targetUser.firstName || "User"}
                className="w-10 h-10 rounded-full object-cover border border-[#C9A227]/40 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] font-bold text-sm">
                {targetUser?.firstName?.[0] || "?"}
              </div>
            )}
            <div>
              <h1 className="font-serif text-base font-bold text-[#F5EFE6] leading-tight">
                {targetUser
                  ? `${targetUser.firstName} ${targetUser.lastName || ""}`
                  : "Loading..."}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-[#A79C8E] font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#0B0A0A]/40">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-6 text-center">
              <div className="max-w-xs space-y-2.5">
                <span className="inline-block p-3 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] text-xl mb-1">
                  ✨
                </span>
                <h3 className="font-serif text-lg font-bold text-[#F5EFE6]">
                  Start the conversation
                </h3>
                <p className="text-[#A79C8E] text-xs leading-relaxed">
                  Ask about their interests, shared vibes, or what caught your eye on their profile.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === userId;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 text-xs sm:text-sm shadow-md ${
                      isOwn
                        ? "bg-[#C9A227] text-[#121011] font-medium rounded-2xl rounded-tr-xs"
                        : "bg-[#1C1917] text-[#F5EFE6] border border-[#2E2A27] rounded-2xl rounded-tl-xs"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-1 text-right font-medium ${
                        isOwn ? "text-[#121011]/70" : "text-[#A79C8E]"
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

        {/* Input Bar */}
        <div className="bg-[#171415] border-t border-[#2E2A27] p-3.5 sm:p-4 flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-[#1C1917] text-[#F5EFE6] placeholder-[#5C5650] rounded-full px-5 py-3 border border-[#2E2A27] focus:outline-none focus:border-[#C9A227] text-xs transition"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-10 h-10 bg-[#C9A227] hover:bg-[#D9B84A] text-[#121011] disabled:opacity-40 disabled:cursor-not-allowed rounded-full flex items-center justify-center font-bold transition active:scale-95 shadow-md cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
