import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Pencil,
  Heart,
  X as XIcon,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const UserCard = ({
  currentProfile,
  user,
  currentUser,
  dragOffset = { x: 0, y: 0 },
  rotation = 0,
  opacity = 1,
  isDragging = false,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  isOwnProfile = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const rafRef = useRef(null);

  const profile = user || currentProfile || currentUser || {};

  const validPhotos = Array.isArray(profile.photos)
    ? profile.photos.filter((p) => typeof p === "string" && p.trim().length > 0)
    : [];

  const photosList =
    validPhotos.length > 0
      ? validPhotos
      : typeof profile.profilePicture === "string" && profile.profilePicture.trim()
        ? [profile.profilePicture.trim()]
        : [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        ];

  const interestsList =
    profile.interests?.length > 0
      ? profile.interests
      : profile.skills?.length > 0
        ? profile.skills
        : ["travel", "live music", "cooking", "hiking"];

  // Calculate completion score for own profile
  const completionScore = React.useMemo(() => {
    let score = 0;
    if (validPhotos.length >= 2) score += 25;
    else if (validPhotos.length === 1) score += 15;
    if (profile.firstName) score += 10;
    if (profile.gender) score += 10;
    if (profile.bio) score += 15;
    if (profile.interests?.length > 0 || profile.skills?.length > 0) score += 15;
    if (profile.location) score += 10;
    if (profile.relationshipGoal) score += 15;
    return Math.min(100, score || 85);
  }, [profile, validPhotos]);

  // Dynamic match score calculation based on profile completion & interests for other profiles
  const matchScore =
    profile.matchScore ??
    Math.min(99, Math.max(60, 72 + interestsList.length * 4 + (profile.bio ? 5 : 0) + (profile.location ? 5 : 0)));

  const activeScore = isOwnProfile ? completionScore : matchScore;

  // Animate the gauge + counter from 0 -> activeScore whenever activeScore changes
  useEffect(() => {
    const duration = 1200; // ms
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * activeScore));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    setAnimatedScore(0);
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [activeScore]);

  // Dynamic compatibility or profile breakdown scores
  const sharedInterestsScore =
    profile.compatibilityBreakdown?.sharedInterests ?? Math.min(95, Math.max(65, 70 + interestsList.length * 5));
  const locationFitScore =
    profile.compatibilityBreakdown?.locationFit ?? (profile.location ? 85 : 60);
  const goalAlignmentScore =
    profile.compatibilityBreakdown?.goalAlignment ?? (profile.relationshipGoal ? 90 : 75);

  const compatBreakdown = isOwnProfile
    ? [
      { label: "Photos & Media", value: validPhotos.length >= 2 ? 100 : 60, color: "#C9A227" },
      { label: "About & Bio", value: profile.bio ? 100 : 50, color: "#7A9174" },
      { label: "Interests & Goals", value: profile.interests?.length ? 100 : 70, color: "#B85C50" },
    ]
    : [
      { label: "Shared interests", value: sharedInterestsScore, color: "#C9A227" },
      { label: "Location fit", value: locationFitScore, color: "#7A9174" },
      { label: "Goal alignment", value: goalAlignmentScore, color: "#B85C50" },
    ];

  // Dynamic mutual connections list
  const mutualConnectionsList =
    profile.mutualConnections || profile.sharedConnections || ["Alex", "Bella", "Chris"];

  const handleNextPhoto = (e) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photosList.length);
  };

  const handlePrevPhoto = (e) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photosList.length) % photosList.length);
  };

  const toggleExpand = (e) => {
    e?.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const locationLabel =
    typeof profile.location === "object"
      ? [profile.location?.city, profile.location?.country].filter(Boolean).join(", ") ||
      "Location unset"
      : profile.location || "Location unset";

  const isVerifiedUser = profile.isVerified || profile.verified || false;
  const isOnlineUser = profile.isOnline || profile.online || true;

  const formatText = (text) => {
    if (!text) return "";
    return text.replace(/_/g, " ").replace(/-/g, " ");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 relative select-none">
      <div className="relative w-full max-w-sm h-[640px]   sm:h-[640px]">
        <div className="absolute -inset-1 bg-[#C9A227]/10 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

        <div
          className="relative w-full h-full bg-[#121011] text-[#F5EFE6] rounded-3xl shadow-2xl overflow-hidden border border-[#2E2A27]"
          style={{
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
            opacity,
            transition: isDragging
              ? "none"
              : "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease-out",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={photosList[currentPhotoIndex] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
            alt={profile?.firstName || "Profile"}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />

          <div className="absolute top-3 inset-x-3 flex gap-1 z-20">
            {photosList.map((_, idx) => (
              <div
                key={idx}
                className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${idx === currentPhotoIndex ? "bg-[#C9A227]" : "bg-white/25"
                  }`}
              />
            ))}
          </div>

          {/* Top bar overlay — Verified badge + edit + match score */}
          <div className="absolute top-7 inset-x-3 flex items-center justify-between z-20">
            <div className="flex items-center gap-1.5 text-white/90 text-[11px] uppercase tracking-[0.15em] bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              <ShieldCheck className={`w-3.5 h-3.5 ${isVerifiedUser ? "text-[#C9A227]" : "text-gray-400"}`} />
              <span>{isVerifiedUser ? "Verified" : "VYBE Member"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {isOwnProfile && (
                <Link
                  to="/profile/edit"
                  title="Edit profile"
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 flex items-center justify-center text-white/90 backdrop-blur-sm transition active:scale-90"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
              )}
              <div
                title={isOwnProfile ? `${activeScore}% profile completion` : `${activeScore}% match`}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-[background] duration-100"
                style={{
                  background: `conic-gradient(#C9A227 ${animatedScore * 3.6}deg, rgba(255,255,255,0.25) 0deg)`,
                }}
              >
                <div className="w-6 h-6 rounded-full bg-[#121011] flex items-center justify-center">
                  <span className="text-[#C9A227] font-bold text-[9px] leading-none tabular-nums">
                    {animatedScore}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {photosList.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-3 top-[38%] -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 flex items-center justify-center text-white backdrop-blur-sm transition active:scale-90 z-20"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-3 top-[38%] -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 flex items-center justify-center text-white backdrop-blur-sm transition active:scale-90 z-20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Collapsed identity strip */}
          {!isExpanded && (
            <div className="absolute bottom-0 inset-x-0 p-5 space-y-1.5 z-10">
              <h2
                onClick={toggleExpand}
                className="cursor-pointer font-serif text-3xl font-semibold text-white tracking-tight flex items-baseline gap-2"
              >
                {profile?.firstName || "User"}
                <span className="text-lg text-white/70 font-normal">{profile?.age || 24}</span>
                {isOnlineUser && <span className="w-2 h-2 rounded-full bg-[#7A9174]" title="online" />}
              </h2>
              <p className="text-[#D9B84A] font-medium text-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {locationLabel}
              </p>
              {profile?.bio && (
                <p className="text-white/80 text-xs italic pt-1">
                  "{profile.bio}"
                </p>
              )}
            </div>
          )}

          {isExpanded && (
            <div className="absolute bottom-0 inset-x-0 h-[78%] rounded-t-3xl bg-[#121011] border-t border-[#2E2A27] shadow-2xl z-20 flex flex-col">
              {/* Sticky header — name + location stay pinned while content scrolls */}
              <div className="shrink-0 px-5 pt-5 pb-3 bg-[#121011] border-b border-[#211D1B] space-y-1">
                <h2
                  onClick={toggleExpand}
                  className="cursor-pointer font-serif text-2xl font-semibold text-white tracking-tight flex items-baseline gap-2"
                >
                  {profile?.firstName || "User"}
                  <span className="text-base text-[#A79C8E] font-normal">{profile?.age || 24}</span>
                </h2>
                <p className="text-[#A79C8E] text-xs flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {locationLabel}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {(profile?.education || profile?.occupation || profile?.currentRole) && (
                  <p className="text-[#A79C8E] text-xs flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {[profile?.education, profile?.occupation || profile?.currentRole].filter(Boolean).join(" • ")}
                  </p>
                )}

                {profile?.bio && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#A79C8E] uppercase tracking-wider">
                      About
                    </p>
                    <div className="p-3.5 bg-[#1C1917] border border-[#2E2A27] rounded-2xl">
                      <p className="text-[#D8CFC2] text-xs italic leading-relaxed">
                        "{profile.bio}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-[#211D1B]">
                  <p className="text-[10px] font-bold text-[#A79C8E] uppercase tracking-wider">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {interestsList.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-[#1C1917] border border-[#2E2A27] hover:border-[#C9A227]/50 rounded-full px-3 py-1 text-[11px] text-[#D8CFC2] transition capitalize"
                      >
                        {formatText(item)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#211D1B]">
                  <p className="text-[10px] font-bold text-[#A79C8E] uppercase tracking-wider">
                    Lifestyle & intent
                  </p>
                  <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#A79C8E]">Looking for</span>
                      <span className="text-[#C9A227] font-semibold capitalize">
                        {formatText(profile?.relationshipGoal) || "Friendship & dating"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A79C8E]">Drinking</span>
                      <span className="text-[#D8CFC2] font-semibold capitalize">{formatText(profile?.drinking) || "Socially"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A79C8E]">Smoking</span>
                      <span className="text-[#D8CFC2] font-semibold capitalize">{formatText(profile?.smoking) || "Non-smoker"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#211D1B]">
                  <p className="text-[10px] font-bold text-[#A79C8E] uppercase tracking-wider">
                    {isOwnProfile ? `Profile completion (${completionScore}%)` : `Why ${matchScore}% match`}
                  </p>
                  <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-3.5 space-y-3 text-xs">
                    {compatBreakdown.map((row) => (
                      <div key={row.label} className="space-y-1">
                        <div className="flex justify-between text-[#A79C8E]">
                          <span>{row.label}</span>
                          <span className="font-bold" style={{ color: row.color }}>
                            {row.value}%
                          </span>
                        </div>
                        <div className="w-full bg-[#2E2A27] rounded-full h-1 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${row.value}%`, backgroundColor: row.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#211D1B]">
                  <p className="text-[10px] font-bold text-[#A79C8E] uppercase tracking-wider">
                    Mutual connections ({mutualConnectionsList.length})
                  </p>
                  <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-3 flex items-center justify-between">
                    <span className="text-xs text-[#A79C8E]">People you both know</span>
                    <div className="flex -space-x-2">
                      {mutualConnectionsList.slice(0, 3).map((conn, idx) => {
                        const bgColors = ["bg-[#C9A227]", "bg-[#7A9174]", "bg-[#B85C50]"];
                        const nameChar = typeof conn === "string" ? conn.charAt(0).toUpperCase() : "M";
                        return (
                          <div
                            key={idx}
                            className={`w-6 h-6 rounded-full ${bgColors[idx % bgColors.length]} border-2 border-[#1C1917] flex items-center justify-center text-[9px] font-bold text-[#121011]`}
                          >
                            {nameChar}
                          </div>
                        );
                      })}
                      {mutualConnectionsList.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-[#2E2A27] border-2 border-[#1C1917] flex items-center justify-center text-[9px] text-[#A79C8E] font-bold">
                          +{mutualConnectionsList.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-1 pb-2 text-center text-[#3A342F] tracking-[0.3em] text-xs">
                  · · ·
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {dragOffset.x > 50 && (
        <div className="absolute top-1/3 left-8 -translate-y-1/2 -rotate-12 bg-[#121011] text-[#7A9174] border-2 border-[#7A9174] px-4 py-2 rounded-xl font-bold shadow-2xl flex items-center gap-2 tracking-widest z-30">
          <Heart className="w-4 h-4 fill-current" /> LIKE
        </div>
      )}
      {dragOffset.x < -50 && (
        <div className="absolute top-1/3 right-8 -translate-y-1/2 rotate-12 bg-[#121011] text-[#B85C50] border-2 border-[#B85C50] px-4 py-2 rounded-xl font-bold shadow-2xl flex items-center gap-2 tracking-widest z-30">
          <XIcon className="w-4 h-4" /> PASS
        </div>
      )}
    </div>
  );
};

export default UserCard;