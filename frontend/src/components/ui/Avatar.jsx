import React from 'react';

export const Avatar = ({ src, name, size = 'md', isOnline = false }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-24 h-24'
  };
  
  return (
    <div className="relative flex-shrink-0">
      <img
        src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'VYBE')}&background=1c1917&color=c9a227`}
        alt={name || 'User'}
        className={`${sizes[size]} rounded-full object-cover border-2 border-[#2E2A27]`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'VYBE')}&background=1c1917&color=c9a227`;
        }}
      />
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#7A9174] border-2 border-[#0B0A0A] rounded-full" />
      )}
    </div>
  );
};

export default Avatar;
