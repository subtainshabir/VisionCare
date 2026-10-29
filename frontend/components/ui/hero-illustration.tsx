import * as React from "react";

export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-lg mx-auto flex items-center justify-center ${className}`.trim()}>
      {/* Ambient Neon Glow Orbs */}
      <div
        className="absolute -top-6 -left-6 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 -right-8 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Dark Translucent HUD Container */}
      <div className="relative z-10 w-full p-4 sm:p-6 bg-[#0F172A]/90 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
        <svg
          viewBox="0 0 460 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          aria-labelledby="hero-illustration-title"
          role="img"
        >
          <title id="hero-illustration-title">
            Digital vision screening HUD concept featuring optical refraction and eye analysis
          </title>

          <defs>
            {/* Neon Cyan Gradient */}
            <linearGradient id="neonCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>

            {/* Glowing Iris Gradient */}
            <linearGradient id="neonIrisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="60%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Dark HUD Card Gradient */}
            <linearGradient id="hudCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
            </linearGradient>

            {/* Electric Glow Filter */}
            <filter id="electricGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22D3EE" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Optical Grid Rays and Focus Targets */}
          <circle cx="230" cy="170" r="130" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="230" cy="170" r="105" stroke="#0E7490" strokeWidth="1" strokeOpacity="0.6" />
          <circle cx="230" cy="170" r="75" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.5" />

          {/* Axis Alignment Crosshairs */}
          <line x1="70" y1="170" x2="115" y2="170" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="345" y1="170" x2="390" y2="170" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="230" y1="25" x2="230" y2="65" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="230" y1="275" x2="230" y2="315" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />

          {/* Central Eye Outline */}
          <g filter="url(#electricGlow)">
            <path
              d="M120 170C155 110 305 110 340 170C305 230 155 230 120 170Z"
              fill="#0A1128"
              stroke="#22D3EE"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </g>

          {/* Iris Outer Ring with Neon Border */}
          <circle cx="230" cy="170" r="48" fill="url(#neonIrisGrad)" stroke="#38BDF8" strokeWidth="2" />

          {/* Iris Inner Geometry */}
          <circle cx="230" cy="170" r="34" fill="#083344" stroke="#06B6D4" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="230" cy="170" r="22" fill="#020617" />

          {/* Specular Highlight Glints */}
          <circle cx="221" cy="160" r="6" fill="#FFFFFF" />
          <circle cx="239" cy="178" r="2.5" fill="#38BDF8" />

          {/* Eyelid Accent Curve */}
          <path
            d="M140 170C165 130 295 130 320 170"
            stroke="#22D3EE"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          {/* Floating HUD Pill 1: Color Vision (Top Right) */}
          <g>
            <rect x="290" y="45" width="140" height="42" rx="14" fill="url(#hudCardGrad)" stroke="#334155" strokeWidth="1" />
            <circle cx="312" cy="66" r="5" fill="#F43F5E" />
            <circle cx="322" cy="66" r="5" fill="#10B981" />
            <circle cx="317" cy="58" r="4" fill="#38BDF8" />
            <text x="336" y="70" fill="#F8FAFC" fontSize="11" fontWeight="600" fontFamily="sans-serif">
              Color Vision
            </text>
          </g>

          {/* Floating HUD Pill 2: Distance Acuity (Left) */}
          <g>
            <rect x="30" y="100" width="130" height="42" rx="14" fill="url(#hudCardGrad)" stroke="#334155" strokeWidth="1" />
            <rect x="44" y="111" width="20" height="20" rx="6" fill="#083344" stroke="#22D3EE" strokeWidth="1" />
            <text x="50" y="126" fill="#22D3EE" fontSize="13" fontWeight="800" fontFamily="monospace">
              E
            </text>
            <text x="72" y="126" fill="#F8FAFC" fontSize="11" fontWeight="600" fontFamily="sans-serif">
              Distance
            </text>
          </g>

          {/* Floating HUD Pill 3: Near Focus (Bottom Right) */}
          <g>
            <rect x="285" y="245" width="145" height="42" rx="14" fill="url(#hudCardGrad)" stroke="#334155" strokeWidth="1" />
            <rect x="300" y="256" width="20" height="20" rx="6" fill="#2E1065" stroke="#C084FC" strokeWidth="1" />
            <path d="M305 264h10M305 268h8" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
            <text x="328" y="271" fill="#F8FAFC" fontSize="11" fontWeight="600" fontFamily="sans-serif">
              Near Reading
            </text>
          </g>
        </svg>

        {/* HUD Status Chip */}
        <div className="mt-2 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Optical Engine Active
          </span>
          <span className="text-slate-500 font-mono text-[10px]">3 Screenings Ready</span>
        </div>
      </div>
    </div>
  );
}
