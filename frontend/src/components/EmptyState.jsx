import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Camera, Heart, MapPin, Users, Rocket,
  Compass, Star, Zap, ArrowRight, UserPlus, CircleCheck,
  Bell, Music
} from 'lucide-react';

const EmptyState = ({ type = 'noMatches', completion = 0, connections = 0 }) => {
  const navigate = useNavigate();

  // ─── Message Configurations ─────────────────────────────────

  const configs = {
    noMatches: {
      icon: Compass,
      gradient: 'from-[#6C63FF] to-[#C9A227]',
      title: 'Your VYBE is waiting',
      subtitle: "We're searching for people who match your energy.",
      stats: [
        { label: 'Complete Profile', value: '10x matches', icon: Star },
        { label: 'Add Photos', value: '3x visibility', icon: Camera },
        { label: 'Set Preferences', value: '5x better matches', icon: Heart },
      ],
      cta: 'Complete Your Profile',
      ctaLink: '/profile/edit',
    },

    lowCompletion: {
      icon: Rocket,
      gradient: 'from-[#FF6B6B] to-[#C9A227]',
      title: `${completion}% Complete — Keep Going!`,
      subtitle: getCompletionMessage(completion),
      stats: [
        { label: 'Photos', value: `${getPhotoScore(completion)}%`, icon: Camera },
        { label: 'Bio', value: `${getBioScore(completion)}%`, icon: Sparkles },
        { label: 'Interests', value: `${getInterestScore(completion)}%`, icon: Music },
      ],
      cta: 'Continue Setup',
      ctaLink: '/profile/edit',
    },

    noConnections: {
      icon: Users,
      gradient: 'from-[#4ECDC4] to-[#C9A227]',
      title: 'Ready to Connect?',
      subtitle: 'The more you share, the better we match you.',
      stats: [
        { label: 'Active Users', value: '2,341 online', icon: Zap },
        { label: 'Matches Today', value: '847 made', icon: Heart },
        { label: 'Your VYBE', value: 'Waiting for you', icon: Sparkles },
      ],
      cta: 'Find Your VYBE',
      ctaLink: '/',
    },

    noNearby: {
      icon: MapPin,
      gradient: 'from-[#6C63FF] to-[#4ECDC4]',
      title: '🌍 Expand Your Horizon',
      subtitle: 'No active users nearby right now. Try expanding your reach!',
      stats: [
        { label: 'Current Radius', value: '50 km', icon: MapPin },
        { label: 'Suggested', value: '100 km', icon: Compass },
        { label: 'Better Matches', value: '+40%', icon: Rocket },
      ],
      cta: 'Expand Radius',
      ctaLink: '/profile/edit',
    },

    pendingRequests: {
      icon: Bell,
      gradient: 'from-[#FF6B6B] to-[#FFB84D]',
      title: '💌 You Have Pending Requests!',
      subtitle: "Someone's waiting for your response. Don't keep them waiting!",
      stats: [
        { label: 'Requests', value: `${connections} pending`, icon: UserPlus },
        { label: 'Response Rate', value: '75%', icon: CircleCheck },
        { label: 'Best Time', value: 'Now!', icon: Zap },
      ],
      cta: 'View Requests',
      ctaLink: '/requests',
    },

    noRequests: {
      icon: Bell,
      gradient: 'from-[#6C63FF] to-[#C9A227]',
      title: 'No Pending Requests',
      subtitle: 'Keep interacting on the feed to get new connection requests!',
      stats: [
        { label: 'Explore Feed', value: 'Find People', icon: Compass },
        { label: 'Complete Profile', value: 'Boost reach', icon: Star },
        { label: 'Send VYBEs', value: 'Connect faster', icon: Heart },
      ],
      cta: 'Explore Feed',
      ctaLink: '/',
    },
  };

  const config = configs[type] || configs.noMatches;

  function getCompletionMessage(percent) {
    if (percent < 30) return 'Start your journey — add your basics!';
    if (percent < 50) return "You're getting there! Add photos & bio.";
    if (percent < 70) return 'Halfway there! Share your interests.';
    if (percent < 90) return 'Almost complete! A few more details.';
    if (percent < 100) return 'So close! Finish up for perfect matches.';
    return '⭐ VYBE Certified! Ready to match!';
  }

  function getPhotoScore(percent) {
    if (percent < 30) return 0;
    if (percent < 50) return 40;
    if (percent < 70) return 60;
    if (percent < 90) return 80;
    return 100;
  }

  function getBioScore(percent) {
    if (percent < 30) return 0;
    if (percent < 50) return 30;
    if (percent < 70) return 50;
    if (percent < 90) return 70;
    return 100;
  }

  function getInterestScore(percent) {
    if (percent < 30) return 0;
    if (percent < 50) return 20;
    if (percent < 70) return 50;
    if (percent < 90) return 80;
    return 100;
  }

  const IconComponent = config.icon;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full bg-[#121011] rounded-3xl border border-[#2E2A27] p-8 shadow-2xl">
        {/* Icon */}
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
          <IconComponent className="w-10 h-10 text-white" />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-2xl font-serif font-bold text-[#F5EFE6] text-center mb-2">
          {config.title}
        </h2>
        <p className="text-[#A79C8E] text-center text-sm mb-6">
          {config.subtitle}
        </p>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          {config.stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#1C1917] rounded-xl px-4 py-3 border border-[#2E2A27]"
            >
              <span className="flex items-center gap-2 text-sm text-[#D8CFC2]">
                <stat.icon className="w-4 h-4 text-[#C9A227]" />
                {stat.label}
              </span>
              <span className="text-sm font-semibold text-[#F5EFE6]">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => navigate(config.ctaLink)}
          className="w-full py-3.5 rounded-full font-bold bg-[#C9A227] text-[#121011] hover:bg-[#D9B84A] transition flex items-center justify-center gap-2 shadow-lg hover:shadow-[#C9A227]/20 active:scale-95 text-sm"
        >
          <span>{config.cta}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Message */}
        <p className="text-xs text-[#5C5650] text-center mt-4">
          {type === 'noMatches' && '💡 Tip: Profiles with 5+ photos get 3x more matches'}
          {type === 'lowCompletion' && '📈 Complete your profile to unlock premium matching'}
          {type === 'noConnections' && '🔥 Active users find matches 5x faster'}
          {type === 'noNearby' && '📍 Update your location for better recommendations'}
          {type === 'pendingRequests' && '⏰ Respond within 24 hours for best results'}
          {type === 'noRequests' && '✨ Keep discovering people on the feed to get matches!'}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
