import React from "react";
import { Star, Building, MapPin, Linkedin, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";

const UserCard = ({
  currentDev,
  dragOffset,
  rotation,
  opacity,
  isDragging,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  isOwnProfile = false,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 relative">
      <div className="relative w-full max-w-sm">
        {/* Background Stack */}
        <div className="absolute inset-0 bg-slate-800/50 rounded-2xl transform rotate-2 scale-95"></div>
        <div className="absolute inset-0 bg-slate-700/50 rounded-2xl transform -rotate-1 scale-97"></div>

        {/* Main Card */}
        <div
          className="relative bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
            opacity: opacity,
            transition: isDragging
              ? "none"
              : "transform 0.3s ease-out, opacity 0.3s ease-out",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Image Section */}
          <div className="relative h-80 bg-gradient-to-br from-purple-400 to-blue-500">
            <img
              src={currentDev.profilePicture}
              alt={currentDev.firstName}
              className="w-full h-full object-cover"
            />

            {/* Edit Button OR Star Rating */}
            {isOwnProfile ? (
              <Link
                to="/profile/edit"
                className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 cursor-pointer"
              >
                <button className="flex items-center gap-1 text-white text-sm font-medium cursor-pointer4 ">
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </Link>
            ) : (
              <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-medium">4.5</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentDev.firstName} {currentDev.lastName}
              </h2>
              <p className="text-purple-600 font-medium">
                {currentDev.currentRole || "Fresher"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Building className="w-4 h-4" />
                <span className="text-sm">{currentDev.company || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentDev.location}</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              {currentDev.bio || "No bio provided."}
            </p>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentDev.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-600">
                {currentDev.totalExperience || 0} yrs experience
              </span>

              {!isOwnProfile && (
                <Linkedin className="w-5 h-5 text-[#0a66c2]" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Indicators */}
      {dragOffset.x > 50 && (
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
          CONNECT
        </div>
      )}
      {dragOffset.x < -50 && (
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
          PASS
        </div>
      )}
    </div>
  );
};

export default UserCard;
