const LandingBg = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="[stop-color:#DBEAFE] dark:[stop-color:#1E293B]" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" className="[stop-color:#FFFFFF] dark:[stop-color:#020817]" />
          </linearGradient>

          <radialGradient id="waveGlow">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="720" cy="500" rx="650" ry="400" fill="url(#waveGlow)" />

        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <path
            key={i}
            d={`M -100 ${350 + i * 35}
                C 250 ${150 + i * 35},
                  450 ${650 + i * 25},
                  750 ${350 + i * 35}
                S 1200 ${150 + i * 35},
                  1540 ${350 + i * 35}`}
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth={i === 3 ? 2 : 1.2}
            className="opacity-[0.22] dark:opacity-[0.16]"
          />
        ))}
      </svg>
    </div>
  );
};

export default LandingBg;