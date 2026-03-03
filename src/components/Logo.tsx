import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`${className} flex flex-col items-center justify-center`}>
      <svg viewBox="0 0 500 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Rainbow */}
        <path d="M 100 250 A 150 150 0 0 1 400 250" fill="none" stroke="#FF5F5F" strokeWidth="25" />
        <path d="M 125 250 A 125 125 0 0 1 375 250" fill="none" stroke="#FFB84D" strokeWidth="25" />
        <path d="M 150 250 A 100 100 0 0 1 350 250" fill="none" stroke="#FFFF66" strokeWidth="25" />
        <path d="M 175 250 A 75 75 0 0 1 325 250" fill="none" stroke="#66FF66" strokeWidth="25" />
        <path d="M 200 250 A 50 50 0 0 1 300 250" fill="none" stroke="#66B2FF" strokeWidth="25" />
        
        {/* Clouds */}
        <g fill="#E0F2FE">
          <circle cx="100" cy="250" r="40" />
          <circle cx="130" cy="230" r="35" />
          <circle cx="400" cy="250" r="40" />
          <circle cx="370" cy="230" r="35" />
        </g>
        
        {/* Sandbox (Isometric) */}
        <path d="M 100 320 L 250 280 L 400 320 L 250 420 Z" fill="#FDE68A" /> {/* Sand */}
        <path d="M 100 320 L 250 420 L 250 440 L 100 340 Z" fill="#BE123C" /> {/* Front Left Wall */}
        <path d="M 250 420 L 400 320 L 400 340 L 250 440 Z" fill="#9F1239" /> {/* Front Right Wall */}
        <path d="M 100 320 L 250 280 L 250 300 L 100 340 Z" fill="#E11D48" /> {/* Top Left Rim */}
        <path d="M 250 280 L 400 320 L 400 340 L 250 300 Z" fill="#BE123C" /> {/* Top Right Rim */}

        {/* Kids (Simplified but recognizable) */}
        {/* Kid 1 (Left) */}
        <circle cx="160" cy="300" r="20" fill="#FDBA74" />
        <path d="M 140 300 Q 160 270 180 300" fill="#3B82F6" /> {/* Blue hair */}
        <rect x="145" cy="320" width="30" height="40" fill="#FACC15" /> {/* Yellow shirt */}
        
        {/* Kid 2 (Middle) */}
        <circle cx="250" cy="280" r="20" fill="#FDBA74" />
        <circle cx="230" cy="270" r="8" fill="#1F2937" /> {/* Pigtail */}
        <circle cx="270" cy="270" r="8" fill="#1F2937" /> {/* Pigtail */}
        <rect x="235" cy="300" width="30" height="40" fill="#FFFFFF" /> {/* White shirt */}
        
        {/* Kid 3 (Right) */}
        <circle cx="340" cy="300" r="20" fill="#FDBA74" />
        <path d="M 320 300 Q 340 270 360 300" fill="#1F2937" /> {/* Black hair */}
        <rect x="325" cy="320" width="30" height="40" fill="#F472B6" /> {/* Pink shirt */}
        
        {/* Sparkles */}
        <path d="M 420 200 L 430 180 L 440 200 L 460 210 L 440 220 L 430 240 L 420 220 L 400 210 Z" fill="#FACC15" />
        <path d="M 60 300 L 70 280 L 80 300 L 100 310 L 80 320 L 70 340 L 60 320 L 40 310 Z" fill="#FACC15" />
      </svg>
    </div>
  );
};
