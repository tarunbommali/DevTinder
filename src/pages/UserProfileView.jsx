import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import {
  ArrowLeft,
  MoreVertical,
  Zap,
  MapPin,
  GraduationCap,
  Briefcase,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";

const UserProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/user/${userId}`, {
          withCredentials: true,
        });
        setUser(res.data?.data || res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("User profile not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12121e] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-sm">Loading VYBE Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#12121e] flex items-center justify-center p-6 text-center">
        <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 max-w-sm">
          <p className="text-gray-300 font-semibold mb-4">{error || "User not found."}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 border-0"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const interestsList =
    user.interests?.length > 0
      ? user.interests
      : user.skills?.length > 0
      ? user.skills
      : ["Chess", "Lo-Fi Music", "Coding", "Chai", "Hiking"];

  // Mock Compatibility Breakdown percentages
  const overallMatch = 88;
  const interestsMatch = 85;
  const locationMatch = 70;
  const goalsMatch = 90;

  const handleConnect = async () => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/interested/${user._id}`,
        {},
        { withCredentials: true }
      );
      alert(`Connection request sent to ${user.firstName}! ✨`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to send request.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d17] text-white pb-24">
      {/* Top Navbar */}
      <div className="sticky top-0 z-40 bg-[#0d0d17]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-200" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-bold text-white">{user.firstName} {user.lastName}</h1>
          <p className="text-[11px] text-purple-400 font-medium">VYBE Member</p>
        </div>

        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
          <MoreVertical className="w-5 h-5 text-gray-200" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl shadow-2xl text-center space-y-4">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Floating Vibe Match Badge */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Active now
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{overallMatch}% Vibe Match</span>
            </div>
          </div>

          {/* Large Avatar with Gradient Border */}
          <div className="relative w-32 h-32 mx-auto mt-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 rounded-full p-1 shadow-xl">
              <img
                src={
                  user.photos?.[0] ||
                  user.profilePicture ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                }
                alt={user.firstName}
                className="w-full h-full object-cover rounded-full bg-gray-950"
              />
            </div>
          </div>

          {/* Name & Primary Info */}
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              {user.firstName} {user.lastName}
              {user.age && <span className="font-light text-gray-400">, {user.age}</span>}
            </h2>
            <p className="text-purple-300 font-medium text-sm flex items-center justify-center gap-1.5 mt-1">
              <Briefcase className="w-4 h-4 text-purple-400" />
              {user.occupation || user.currentRole || "Member"}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                {typeof user.location === "object"
                  ? [user.location?.city, user.location?.country].filter(Boolean).join(", ") || "Nearby"
                  : user.location || "Nearby"}
              </span>
              {user.education && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  {user.education}
                </span>
              )}
            </div>
          </div>

          {/* Bio Quote Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
            <p className="text-gray-300 text-sm italic leading-relaxed">
              "{user.bio || "Building genuine connections through shared passions and authentic vibes."}"
            </p>
          </div>
        </div>

        {/* Passions & Vibe Grid */}
        <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Their Vibe & Passions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {interestsList.map((interest, idx) => (
              <div
                key={idx}
                className="bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-3 flex items-center gap-2.5 transition transform hover:scale-[1.02]"
              >
                <span className="text-xl">✨</span>
                <span className="text-xs font-semibold text-purple-200">{interest}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle Details */}
        <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎯</span> Lifestyle & Intent
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-gray-400">Looking For</span>
              <span className="text-pink-300 font-bold">{user.relationshipGoal || "Friendship & Dating"}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-gray-400">Drinking</span>
              <span className="text-gray-200 font-semibold">{user.drinking || "Socially"}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-gray-400">Smoking</span>
              <span className="text-gray-200 font-semibold">{user.smoking || "Non-smoker"}</span>
            </div>
          </div>
        </div>

        {/* Compatibility Breakdown */}
        <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>📊</span> Compatibility Breakdown
            </h3>
            <span className="text-xs font-bold text-purple-400">{overallMatch}% Total Match</span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Interests Match Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">Shared Interests</span>
                <span className="text-purple-300 font-bold">{interestsMatch}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                  style={{ width: `${interestsMatch}%` }}
                ></div>
              </div>
            </div>

            {/* Location Match Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">Location Proximity</span>
                <span className="text-purple-300 font-bold">{locationMatch}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                  style={{ width: `${locationMatch}%` }}
                ></div>
              </div>
            </div>

            {/* Goals Match Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">Life Goals & Intent</span>
                <span className="text-purple-300 font-bold">{goalsMatch}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-amber-400 h-2.5 rounded-full"
                  style={{ width: `${goalsMatch}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Connections Stack */}
        <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 flex items-center justify-between backdrop-blur-xl">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Shared Connections
            </h3>
            <p className="text-xs text-gray-400">You both match with creative developers</p>
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">A</div>
            <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">B</div>
            <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">C</div>
            <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-[10px] text-gray-300 font-bold">+3</div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d0d17]/90 backdrop-blur-xl border-t border-white/10 py-3.5 px-6 z-50 flex items-center justify-center gap-4">
        <Link
          to={`/chat/${user._id}`}
          className="flex-1 max-w-xs bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 border border-white/10 transition active:scale-95 text-sm"
        >
          <MessageCircle className="w-4 h-4 text-purple-400" />
          <span>Say Hi 💬</span>
        </Link>

        <button
          onClick={handleConnect}
          className="flex-1 max-w-xs bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 shadow-xl transition transform active:scale-95 text-sm"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>Connect ✨</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfileView;
