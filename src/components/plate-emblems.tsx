import { useId } from 'react';

export function SaudiEmblem({
  className = '',
  size = 20,
  fillColor = '#0b0f17',
  strokeColor,
  treeColor,
  swordsColor,
}: {
  className?: string;
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  treeColor?: string;
  swordsColor?: string;
}) {
  const palmFill = treeColor ?? fillColor;
  const saberFill = swordsColor ?? strokeColor ?? fillColor;

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Crisp Optical-Grade Saudi Date Palm (الشجرة) */}
      <g fill={palmFill}>
        {/* Upright Center Crown Spear */}
        <path d="M 60,3.5 C 55.5,14.5 56,26.5 60,38 C 64,26.5 64.5,14.5 60,3.5 Z" />

        {/* Upper-Inner Arching Fronds */}
        <path d="M 58.8,35.5 C 50.5,20.5 37.5,10 21.5,11 C 33.5,16.8 43.5,26 55.2,38.5 Z" />
        <path d="M 61.2,35.5 C 69.5,20.5 82.5,10 98.5,11 C 86.5,16.8 76.5,26 64.8,38.5 Z" />

        {/* Mid-Upper Sweeping Fronds */}
        <path d="M 57.8,39.5 C 44,26.5 25,20.5 8.5,26.5 C 23.5,29 38.5,34.5 54.2,43 Z" />
        <path d="M 62.2,39.5 C 76,26.5 95,20.5 111.5,26.5 C 96.5,29 81.5,34.5 65.8,43 Z" />

        {/* Mid-Lower Classic Date-Palm Fronds */}
        <path d="M 56.8,43.5 C 40.5,35 20,35.5 6,46.5 C 21.5,44 37.5,44.5 53.8,47.5 Z" />
        <path d="M 63.2,43.5 C 79.5,35 100,35.5 114,46.5 C 98.5,44 82.5,44.5 66.2,47.5 Z" />

        {/* Lower Drooping Fronds */}
        <path d="M 56.2,47.5 C 41.5,44.5 25.5,49.5 15,61.5 C 28.5,55.5 41.5,52.2 54.8,51.2 Z" />
        <path d="M 63.8,47.5 C 78.5,44.5 94.5,49.5 105,61.5 C 91.5,55.5 78.5,52.2 65.2,51.2 Z" />

        {/* Sculpted Date Clusters */}
        <ellipse cx="48.5" cy="55.5" rx="2.7" ry="4" transform="rotate(18 48.5 55.5)" />
        <ellipse cx="71.5" cy="55.5" rx="2.7" ry="4" transform="rotate(-18 71.5 55.5)" />

        {/* Tapered Segmented Palm Trunk */}
        <path d="M 56.2,41.5 L 63.8,41.5 L 65.8,64 C 66.6,69.8 69.2,73.2 72.5,75.2 L 47.5,75.2 C 50.8,73.2 53.4,69.8 54.2,64 Z" />
      </g>

      {/* Crossed Curved Arabian Scimitars (السيفان العربيان) */}
      <g fill={saberFill}>
        {/* Left-Hilt to Right-Tip Scimitar */}
        <path d="M 28.5,105.5 C 48,93 74.5,81.8 110,79 C 97.5,87.8 73,97 33.8,110.8 Z" />
        <path d="M 25,100.8 L 38.5,114 L 34.8,117.2 L 21.3,104 Z" />
        <path d="M 28,107.2 L 18.5,115.5 C 15.2,117.8 12,115.2 13.8,111.5 L 24,103.5 Z" />

        {/* Right-Hilt to Left-Tip Scimitar */}
        <path d="M 91.5,105.5 C 72,93 45.5,81.8 10,79 C 22.5,87.8 47,97 86.2,110.8 Z" />
        <path d="M 95,100.8 L 81.5,114 L 85.2,117.2 L 98.7,104 Z" />
        <path d="M 92,107.2 L 101.5,115.5 C 104.8,117.8 108,115.2 106.2,111.5 L 96,103.5 Z" />
      </g>
    </svg>
  );
}

export function FbsPlateEmblem({
  width,
  height,
  className = '',
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const navyGradId = `fbs-navy-${uid}`;
  const goldGradId = `fbs-gold-${uid}`;
  const goldTrimId = `fbs-trim-${uid}`;
  const embossFilterId = `fbs-emboss-${uid}`;

  return (
    <svg
      viewBox="0 0 260 154"
      width={width}
      height={height}
      className={`q-fbs-emblem shrink-0 ${className}`}
      aria-label="شعار FBS الرسمي"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Deep Royal Midnight Navy Metallic Ink for High-Contrast Stamped Legibility */}
        <linearGradient id={navyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e2f53" />
          <stop offset="45%" stopColor="#121e38" />
          <stop offset="100%" stopColor="#091122" />
        </linearGradient>

        {/* Rich Burnished Champagne-Bronze Gold for GT Coupé Silhouette */}
        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="18%">
          <stop offset="0%" stopColor="#8c621e" />
          <stop offset="28%" stopColor="#c79a4b" />
          <stop offset="55%" stopColor="#ddb66c" />
          <stop offset="82%" stopColor="#b58636" />
          <stop offset="100%" stopColor="#7f5718" />
        </linearGradient>

        {/* Subtle Metallic Gold Bevel Rim */}
        <linearGradient id={goldTrimId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2be78" />
          <stop offset="50%" stopColor="#b88938" />
          <stop offset="100%" stopColor="#8f651f" />
        </linearGradient>

        {/* Crisp Die-Stamped Aluminum Relief */}
        <filter id={embossFilterId} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="-0.65" stdDeviation="0.25" floodColor="#ffffff" floodOpacity="0.9" />
          <feDropShadow dx="0" dy="1.1" stdDeviation="0.55" floodColor="#0b1324" floodOpacity="0.24" />
        </filter>
      </defs>

      <g filter={`url(#${embossFilterId})`}>
        {/* ================= 1. SLEEK GT SPORTS COUPÉ SILHOUETTE ================= */}
        <g>
          {/* Sweeping Fastback Roofline & Ducktail Spoiler */}
          <path
            d="M 10,25.5 C 21,29 33,27.5 50,22 C 78,12.5 103,7.5 127,8.2 C 149,8.8 168,15.5 188,26.8 L 183.5,28.2 C 164,18.5 146,13.2 126.5,12.8 C 103,12.2 79,17 51,26.5 C 34,32 21,33.5 10,25.5 Z"
            fill={`url(#${goldGradId})`}
            stroke="#5e3f10"
            strokeWidth="0.45"
            strokeLinejoin="round"
          />

          {/* Sculpted Rear Decklid & C-Pillar Flow */}
          <path
            d="M 22,33.2 C 42,27.8 66,26.8 98,30.5 C 70,31.2 46,31.5 27,36.2 C 23,37 19.5,35.5 22,33.2 Z"
            fill={`url(#${goldGradId})`}
          />

          {/* Long Muscular GT Hood & Front Fender Horizon */}
          <path
            d="M 65,25.8 C 105,30.8 147,31.4 185,32 C 213,32.5 234,38 250,49.5 C 232,42.5 212,37.8 184.5,37 C 145,36 103,35 65,27.6 Z"
            fill={`url(#${navyGradId})`}
          />

          {/* Dynamic Aerodynamic Waist Crease */}
          <path
            d="M 94,46.2 C 127,40.2 165,39.8 202,42.6 C 166,44 128,44.6 94,46.2 Z"
            fill={`url(#${goldGradId})`}
            stroke="#5e3f10"
            strokeWidth="0.35"
          />

          {/* Aggressive Predator LED Headlamp Eye */}
          <path
            d="M 212,42.2 C 221,41.8 233,45.5 242,51.6 C 231,50.8 221,48.2 215,44.8 Z"
            fill={`url(#${goldGradId})`}
            stroke="#5e3f10"
            strokeWidth="0.4"
          />

          {/* Rear Tapered Wheel Arch */}
          <path
            d="M 39,62.5 C 40.2,49.2 48,43 57.5,43 C 67,43 74.8,49.2 76,62.5 C 73.2,52.2 66.2,47.5 57.5,47.5 C 48.8,47.5 41.8,52.2 39,62.5 Z"
            fill={`url(#${navyGradId})`}
          />

          {/* Front Tapered Wheel Arch */}
          <path
            d="M 180,65 C 181.2,51.8 189,45.6 198.5,45.6 C 208,45.6 215.8,51.8 217,65 C 214.2,54.8 207.2,50.1 198.5,50.1 C 189.8,50.1 182.8,54.8 180,65 Z"
            fill={`url(#${navyGradId})`}
          />

          {/* Sculpted Lower Rocker Sill Blade */}
          <path
            d="M 83,62.5 C 113,64.2 144,65 173,64.8 C 144,67.6 113,66.6 83,62.5 Z"
            fill={`url(#${goldGradId})`}
            stroke="#5e3f10"
            strokeWidth="0.35"
          />
        </g>

        {/* ================= 2. PRECISION CUSTOM 'FBS' MONOGRAM ================= */}
        <g stroke={`url(#${goldTrimId})`} strokeWidth="0.9" strokeLinejoin="round">
          {/* Connected 'FB' Ligature with Signature Speed-Slot & Diagonal Crossbar */}
          <path
            fill={`url(#${navyGradId})`}
            fillRule="evenodd"
            d="M 22,79 H 131 C 142.2,79 149.8,86 149.8,96.5 C 149.8,103.6 145.6,109.2 139,111.6 C 147.2,114.2 152.2,120.8 152.2,129.4 C 152.2,139 144.2,145.5 133,145.5 H 90 V 98.2 H 110 V 104.8 H 130 C 133.6,104.8 135.8,102.3 135.8,99.4 C 135.8,96.5 133.6,94 130,94 H 42 V 104.8 H 83 L 72,119.8 H 42 V 145.5 H 22 Z M 110,119.8 H 131.5 C 135.6,119.8 138.2,122.4 138.2,125.2 C 138.2,128.1 135.6,130.5 131.5,130.5 H 110 Z"
          />

          {/* Precision Sporty 'S' with Matching Diagonal Top-Right Cut */}
          <path
            fill={`url(#${navyGradId})`}
            d="M 182,79 H 238 L 227,94 H 183 C 178.4,94 176,96.5 176,99.4 C 176,102.3 178.4,104.8 183,104.8 H 214 C 228.2,104.8 238.2,113.4 238.2,125.2 C 238.2,137 228.2,145.5 214,145.5 H 165.5 C 161,145.5 158,142.1 158,138 C 158,133.9 161,130.5 165.5,130.5 H 213 C 217.6,130.5 220.2,128.1 220.2,125.2 C 220.2,122.4 217.6,119.8 213,119.8 H 182 C 167.8,119.8 158,111.2 158,99.4 C 158,87.6 167.8,79 182,79 Z"
          />
        </g>
      </g>
    </svg>
  );
}
