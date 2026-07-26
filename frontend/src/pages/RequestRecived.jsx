/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Search, ArrowLeft, Check, X, UserCheck, Sparkles, ChevronRight } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/ui/Avatar";
import UserCard from "../components/UserCard";

const RequestReceived = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userState = useSelector((state) => state.user || {});
  const currentUser = userState.user || (userState.firstName ? userState : null);
  const isAuthChecked = userState.isAuthChecked;

  const requests = useSelector((store) => store.requests || []);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const CONNECTION_RECEIVE_ENDPOINT = `${BASE_URL}/user/requests/received`;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(CONNECTION_RECEIVE_ENDPOINT, {
        withCredentials: true,
      });

      const requestsArray = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      dispatch(addRequests(requestsArray));

      if (requestsArray.length > 0 && !selectedRequest) {
        setSelectedRequest(requestsArray[0]);
      }
    } catch (error) {
      console.error("Error fetching received requests:", error.message);
      dispatch(addRequests([]));
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const REVIEW_ENDPOINT = `${BASE_URL}/request/review/accepted/${requestId}`;
      const response = await axios.post(REVIEW_ENDPOINT, {}, { withCredentials: true });
      setActionMessage(response.data.message || "Connection request accepted!");
      dispatch(removeRequest(requestId));

      // Select next request if available
      const remaining = requests.filter((r) => r._id !== requestId);
      setSelectedRequest(remaining.length > 0 ? remaining[0] : null);
      setTimeout(() => setActionMessage(""), 3000);
    } catch (error) {
      console.error("Error accepting request:", error.message);
      setActionMessage("Failed to accept request.");
      setTimeout(() => setActionMessage(""), 3000);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const REVIEW_ENDPOINT = `${BASE_URL}/request/review/rejected/${requestId}`;
      const response = await axios.post(REVIEW_ENDPOINT, {}, { withCredentials: true });
      setActionMessage(response.data.message || "Connection request declined.");
      dispatch(removeRequest(requestId));

      // Select next request if available
      const remaining = requests.filter((r) => r._id !== requestId);
      setSelectedRequest(remaining.length > 0 ? remaining[0] : null);
      setTimeout(() => setActionMessage(""), 3000);
    } catch (error) {
      console.error("Error rejecting request:", error.message);
      setActionMessage("Failed to decline request.");
      setTimeout(() => setActionMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Update selection if current selection is no longer in list
  useEffect(() => {
    if (requests.length > 0) {
      if (!selectedRequest || !requests.find((r) => r._id === selectedRequest._id)) {
        setSelectedRequest(requests[0]);
      }
    } else {
      setSelectedRequest(null);
    }
  }, [requests]);

  // Filtered requests list
  const filteredRequests = requests.filter((req) => {
    const name = `${req.fromUserId?.firstName || ""} ${req.fromUserId?.lastName || ""}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (isAuthChecked && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-full bg-[#0B0A0A] text-[#F5EFE6] select-none flex overflow-hidden border-t border-[#2E2A27]">
      {/* ─── LEFT PANEL: REQUESTS SIDEBAR ─── */}
      <div
        className={`${
          selectedRequest ? "hidden md:flex" : "flex"
        } w-full md:w-80 lg:w-96 border-r border-[#2E2A27] flex-col bg-[#0B0A0A] shrink-0 h-full overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#2E2A27]/60">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base text-[#F5EFE6] tracking-tight">
              Requests
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] font-bold text-[11px]">
              {requests.length}
            </span>
          </div>
          <Link
            to="/connections"
            className="text-xs font-semibold text-[#C9A227] hover:underline"
          >
            Messages
          </Link>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-[#2E2A27]/40">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-[#A79C8E] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests..."
              className="w-full bg-[#1C1917] text-[#F5EFE6] placeholder-[#A79C8E] rounded-xl pl-10 pr-4 py-2 border border-[#2E2A27] focus:outline-none focus:border-[#C9A227] text-xs transition"
            />
          </div>
        </div>

        {/* Action Toast Alert */}
        {actionMessage && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-[#7A9174]/15 border border-[#7A9174]/30 text-[#7A9174] text-xs font-semibold text-center animate-slide-in">
            {actionMessage}
          </div>
        )}

        {/* Requests List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2 space-y-1">
          {loading ? (
            <div className="p-8 text-center text-[#A79C8E] text-xs">
              Loading requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <span className="text-2xl">🤝</span>
              <p className="text-xs text-[#A79C8E] font-medium">
                No pending requests right now.
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const name = `${req.fromUserId?.firstName || "Member"} ${req.fromUserId?.lastName || ""}`.trim();
              const photo = req.fromUserId?.profilePicture;
              const isSelected = selectedRequest?._id === req._id;

              return (
                <div
                  key={req._id}
                  onClick={() => setSelectedRequest(req)}
                  className={`flex items-center px-3 py-3 rounded-2xl transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-[#1C1917] border border-[#2E2A27]"
                      : "hover:bg-[#121011] border border-transparent"
                  }`}
                >
                  <Avatar src={photo} name={name} size="md" />

                  <div className="flex-1 min-w-0 ml-3">
                    <h3
                      className={`text-xs font-semibold truncate ${
                        isSelected ? "text-[#C9A227]" : "text-[#F5EFE6]"
                      }`}
                    >
                      {name}
                    </h3>
                    <p className="text-[11px] text-[#A79C8E] truncate mt-0.5">
                      Wants to connect with your VYBE
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#5C5650] shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── RIGHT PANEL: ACTIVE PROFILE PREVIEW & ACCEPT/DECLINE ─── */}
      <div
        className={`${
          selectedRequest ? "flex" : "hidden md:flex"
        } flex-1 flex-col bg-[#0B0A0A] h-full relative overflow-hidden`}
      >
        {selectedRequest && selectedRequest.fromUserId ? (
          <>
            {/* Top Bar */}
            <div className="px-5 py-3.5 bg-[#121011] border-b border-[#2E2A27] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="md:hidden text-[#A79C8E] hover:text-[#F5EFE6] transition p-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <Avatar
                  src={selectedRequest.fromUserId?.profilePicture}
                  name={`${selectedRequest.fromUserId?.firstName} ${selectedRequest.fromUserId?.lastName}`}
                  size="sm"
                />

                <div>
                  <h3 className="font-serif text-sm font-bold text-[#F5EFE6] leading-tight">
                    {selectedRequest.fromUserId?.firstName} {selectedRequest.fromUserId?.lastName}
                  </h3>
                  <span className="text-[10px] text-[#C9A227] font-medium">
                    Wants to connect
                  </span>
                </div>
              </div>

              {/* Header Quick Decision Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAccept(selectedRequest._id)}
                  className="bg-[#C9A227] hover:bg-[#D9B84A] text-[#121011] font-bold px-4 py-2 rounded-full text-xs transition active:scale-95 shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(selectedRequest._id)}
                  className="bg-[#1C1917] hover:bg-red-950/40 text-[#B85C50] border border-[#2E2A27] font-semibold px-4 py-2 rounded-full text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  Decline
                </button>
              </div>
            </div>

            {/* Profile Card Preview Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col items-center bg-[#0B0A0A]">
              <div className="w-full max-w-sm">
                <UserCard
                  user={selectedRequest.fromUserId}
                  isOwnProfile={true}
                />
              </div>
            </div>

            {/* Bottom Floating Decision Bar */}
            <div className="p-4 bg-[#121011] border-t border-[#2E2A27] shrink-0 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleReject(selectedRequest._id)}
                className="flex-1 max-w-xs bg-[#1C1917] hover:bg-red-950/40 text-[#B85C50] border border-[#2E2A27] font-bold py-3 rounded-full text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                Decline Request
              </button>
              <button
                type="button"
                onClick={() => handleAccept(selectedRequest._id)}
                className="flex-1 max-w-xs bg-[#C9A227] hover:bg-[#D9B84A] text-[#121011] font-bold py-3 rounded-full text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Accept & Connect
              </button>
            </div>
          </>
        ) : (
          /* Empty Request View (No Selection) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full border-2 border-[#C9A227]/40 bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] shadow-xl">
              <UserCheck className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#F5EFE6]">
              Connection Requests
            </h2>
            <p className="text-xs text-[#A79C8E] max-w-sm leading-relaxed">
              Select a connection request from the left panel to inspect their full profile card preview and accept or decline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestReceived;
