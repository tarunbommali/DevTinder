import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "../components/UserCard";
import EmptyState from "../components/EmptyState";
import { useNavigate, Navigate } from "react-router-dom";

import {
  Star,
  Building,
  MapPin,
  MessageCircle,
  X,
  Heart,
  Maximize2,
  Settings,
} from "lucide-react";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feed = useSelector((state) => state.feed.data);
  const [currentCard, setCurrentCard] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const getFeed = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/feed`, {
          withCredentials: true,
        });
        dispatch(addFeed(response.data.data));
      } catch (error) {
        if (error?.response?.status === 401 || error?.status === 401) {
          navigate("/login");
        }
        console.error("Error fetching feed data:", error);
      }
    };
    getFeed();
  }, [dispatch, navigate]);

  const handleSwipe = async (direction) => {
    const currentUser = feed[currentCard];
    if (!currentUser) return;

    const status = direction === "right" ? "interested" : "ignored";

    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${currentUser._id}`,
        {},
        { withCredentials: true }
      );
      // Remove swiped user from feed to prevent duplicate requests
      dispatch(removeUserFromFeed(currentUser._id));
    } catch (error) {
      if (error?.response?.status === 401 || error?.status === 401) {
        navigate("/login");
      }
      console.error(`Error sending ${status} request:`, error?.response?.data?.message || error.message);
    }

    setDragOffset({ x: 0, y: 0 });
    setRotation(0);
    setOpacity(1);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const offsetX = touch.clientX - window.innerWidth / 2;
    const offsetY = touch.clientY - window.innerHeight / 2;
    setDragOffset({ x: offsetX, y: offsetY });
    setRotation(offsetX / 20);
    setOpacity(1 - Math.abs(offsetX) / 300);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset.x > 50) {
      handleSwipe("right");
    } else if (dragOffset.x < -50) {
      handleSwipe("left");
    } else {
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
      setOpacity(1);
    }
  };

  const userState = useSelector((state) => state.user || {});
  const currentUser = userState.user || (userState.firstName ? userState : null);
  const isAuthChecked = userState.isAuthChecked;
  const targetUser = feed?.[currentCard];

  if (isAuthChecked && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!targetUser) {
    return <EmptyState type="noMatches" />;
  }

  return (
    <>
      <UserCard
        user={targetUser}
        dragOffset={dragOffset}
        rotation={rotation}
        opacity={opacity}
        isDragging={isDragging}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />

      {/* Streamlined 3 Core Action Buttons */}
      <div className="flex items-center justify-center space-x-6 py-6 px-4">
        {/* 1. Skip / Pass */}
        <button
          onClick={() => handleSwipe("left")}
          title="Pass (Skip for now)"
          className="w-14 h-14 bg-gray-800/80 hover:bg-slate-700/90 text-gray-400 hover:text-white border border-white/10 rounded-full flex items-center justify-center shadow-xl transform active:scale-90 transition-all backdrop-blur-md group relative"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-9 bg-gray-900 text-gray-300 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none whitespace-nowrap">
            Pass
          </span>
        </button>

        {/* 2. Bookmark / Save for Later */}
        <button
          onClick={() => alert(`Saved ${targetUser?.firstName} for later!`)}
          title="Save for Later"
          className="w-13 h-13 bg-gray-800/80 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center shadow-xl transform active:scale-90 transition-all backdrop-blur-md group relative"
        >
          <Star className="w-5 h-5 fill-amber-400/20 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-9 bg-gray-900 text-amber-300 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-amber-500/20 pointer-events-none whitespace-nowrap">
            Bookmark
          </span>
        </button>

        {/* 3. Connect / Send a VYBE */}
        <button
          onClick={() => handleSwipe("right")}
          title="Connect (Send a VYBE)"
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-95 transition-all border border-white/20 group relative"
        >
          <Heart className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-9 bg-purple-900 text-purple-200 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-purple-400/30 pointer-events-none whitespace-nowrap">
            Connect
          </span>
        </button>
      </div>

      {/* Bottom Navigation Indicator */}
      <div className="flex justify-center pb-6">
        <div className="flex space-x-2">
          {feed.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentCard ? "w-6 bg-purple-400" : "w-1.5 bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Feed;
