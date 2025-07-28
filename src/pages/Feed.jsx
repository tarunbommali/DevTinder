import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "../components/UserCard";
 
import {
  Star,
  Building,
  MapPin,
  MessageCircle,
  X,
  Heart,
  Settings,
} from "lucide-react";

const Feed = () => {
  const dispatch = useDispatch();
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
        console.error("Error fetching feed data:", error);
      }
    };
    getFeed();
  }, [dispatch]);

  const handleSwipe = (direction) => {
    if (direction === "left") {
      console.log("PASS:", feed[currentCard]);
    } else {
      console.log("CONNECT:", feed[currentCard]);
    }
    setDragOffset({ x: 0, y: 0 });
    setOpacity(1);
    setCurrentCard((prev) => (prev + 1 < feed.length ? prev + 1 : 0));
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

  const currentDev = feed?.[currentCard];

  if (!currentDev) {
    return <div className="p-4 text-center">No users to show in feed.</div>;
  }

  return (
    <>
      <UserCard
        currentDev={currentDev}
        dragOffset={dragOffset}
        rotation={rotation}
        opacity={opacity}
        isDragging={isDragging}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-8 p-6">
        <button
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-all"
        >
          <Heart className="w-7 h-7 text-white" />
        </button>
        <button className="w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-all">
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* Bottom Navigation Indicator */}
      <div className="flex justify-center pb-4">
        <div className="flex space-x-2">
          {feed.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentCard ? "bg-purple-400" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Feed;
