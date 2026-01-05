
import React from 'react';

const Premium3DEmoji: React.FC<{ type: 'happy' | 'neutral' | 'sad'; size?: number }> = ({ type, size = 32 }) => {
  const themes = {
    happy: { base: '#10b981', light: '#34d399', dark: '#064e3b' },
    neutral: { base: '#f59e0b', light: '#fbbf24', dark: '#451a03' },
    sad: { base: '#f43f5e', light: '#fb7185', dark: '#4c0519' }
  };

  const colors = themes[type];

  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="drop-shadow-2xl transition-all duration-300">
      <defs>
        <radialGradient id={`atom-grad-${type}`} cx="30%" cy="30%" r="75%">
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="60%" stopColor={colors.base} />
          <stop offset="100%" stopColor={colors.dark} />
        </radialGradient>
      </defs>
      
      {/* 3D Sphere with slight chromatic aberration shadow */}
      <circle cx="52" cy="52" r="46" fill="#ff00ff" opacity="0.1" />
      <circle cx="48" cy="48" r="46" fill="#00ffff" opacity="0.1" />
      <circle cx="50" cy="50" r="46" fill={`url(#atom-grad-${type})`} />
      
      {/* Glossy Specular */}
      <ellipse cx="33" cy="28" rx="12" ry="6" fill="white" fillOpacity="0.4" transform="rotate(-30, 33, 28)" />

      {/* High-Contrast Face */}
      <g fill="#1a1a1a">
        <circle cx="34" cy="44" r="5" />
        <circle cx="66" cy="44" r="5" />
        {/* Expressions */}
        {type === 'happy' && (
          <path d="M32 64 Q50 82 68 64" fill="none" stroke="#1a1a1a" strokeWidth="7" strokeLinecap="round" />
        )}
        {type === 'neutral' && (
          <rect x="35" y="65" width="30" height="7" rx="3.5" />
        )}
        {type === 'sad' && (
          <path d="M34 72 Q50 60 66 72" fill="none" stroke="#1a1a1a" strokeWidth="7" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
};

const ChromaticVoxel: React.FC<{ delay: number; color: string; duration: number; distance: number; type: 'cube' | 'x' }> = ({ delay, color, duration, distance, type }) => (
  <div 
    className="absolute flex items-center justify-center animate-pulse"
    style={{
      color: color,
      animation: `chromaticFloat ${duration}s infinite linear`,
      animationDelay: `${delay}s`,
      '--distance': `${distance}px`
    } as any}
  >
    {type === 'cube' ? (
      <div className="w-1.5 h-1.5 bg-current" style={{ boxShadow: `1.5px 1.5px 0px rgba(0,0,0,0.3)` }} />
    ) : (
      <span className="text-[10px] font-pixel font-bold">X</span>
    )}
  </div>
);

const HeartbeatPulse: React.FC = () => {
  // Generate a circular ECG signal path
  const radius = 88;
  const centerX = 100;
  const centerY = 100;
  let d = "";
  const steps = 180;
  
  for (let i = 0; i <= steps; i++) {
    const angle = (i * 360 / steps) * (Math.PI / 180);
    let r = radius;
    
    // Create rhythmic ECG spikes at specific intervals
    const phase = i % 45;
    if (phase === 10) r += 4; // P wave
    if (phase === 15) r -= 3; // Q
    if (phase === 17) r += 15; // R spike
    if (phase === 19) r -= 8; // S
    if (phase === 25) r += 6; // T wave
    
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    d += `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }
  d += " Z";

  return (
    <svg className="absolute w-[110%] h-[110%] pointer-events-none" viewBox="0 0 200 200">
      <defs>
        <filter id="pulse-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Background static trace */}
      <path 
        d={d} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="0.5" 
        strokeOpacity="0.1" 
        className="text-cyan-400"
      />
      {/* Animated traveling pulse head */}
      <path 
        d={d} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeDasharray="20 180" 
        filter="url(#pulse-glow)"
        className="text-cyan-400"
        style={{
          animation: 'pulseTravel 3s linear infinite'
        }}
      />
      <style>{`
        @keyframes pulseTravel {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
};

const NodeGraph: React.FC = () => {
  const getHexPoint = (centerX: number, centerY: number, radius: number, index: number) => {
    const angle = (index * 60 - 30) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const layers = [
    { r: 45, opacity: 0.15 },
    { r: 75, opacity: 0.1 },
    { r: 95, opacity: 0.05 }
  ];

  return (
    <svg className="absolute w-[140%] h-[140%] opacity-40 pointer-events-none animate-[spin_60s_linear_infinite]" viewBox="0 0 200 200">
      <defs>
        <filter id="glow-strong">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <g stroke="currentColor" fill="none" filter="url(#glow-strong)" className="text-cyan-500/30">
        {layers.map((layer, lIdx) => {
          const points = Array.from({ length: 6 }).map((_, i) => getHexPoint(100, 100, layer.r, i));
          const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          
          return (
            <React.Fragment key={lIdx}>
              <path d={path} strokeWidth="0.5" strokeOpacity={layer.opacity * 2} />
              <circle cx="100" cy="100" r={layer.r} strokeWidth="0.2" strokeOpacity={layer.opacity} strokeDasharray="2 4" />
              {points.map((p, pIdx) => (
                <line key={pIdx} x1="100" y1="100" x2={p.x} y2={p.y} strokeWidth="0.3" strokeOpacity={layer.opacity} />
              ))}
              {points.map((p, pIdx) => (
                <circle key={`pulse-${lIdx}-${pIdx}`} r="1.5" fill="currentColor" className="animate-pulse">
                  <animateMotion dur={`${3 + lIdx}s`} repeatCount="indefinite" path={`M 100 100 L ${p.x} ${p.y}`} begin={`${pIdx * 0.5}s`} />
                </circle>
              ))}
              {points.map((p, pIdx) => (
                <circle key={`node-${lIdx}-${pIdx}`} cx={p.x} cy={p.y} r="1.5" fill="currentColor" fillOpacity={layer.opacity * 4} />
              ))}
            </React.Fragment>
          );
        })}
      </g>
    </svg>
  );
};

export const EmojiAtom: React.FC = () => {
  return (
    <div className="relative w-52 h-52 flex items-center justify-center group">
      {/* Chromatic Background Glow */}
      <div className="absolute w-36 h-36 rounded-full bg-cyan-500/20 blur-3xl animate-pulse mix-blend-screen" />
      <div className="absolute w-36 h-36 rounded-full bg-pink-500/20 blur-3xl animate-pulse mix-blend-screen delay-700" />
      
      {/* The Neural Node Graph Background */}
      <NodeGraph />
      
      {/* Heartbeat Pulse Effect */}
      <HeartbeatPulse />

      {/* The Orbital Ring System */}
      <svg className="absolute w-full h-full rotate-x-65 pointer-events-none" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="ring-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00ffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff00ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle 
          cx="100" cy="100" r="90" 
          fill="none" 
          stroke="url(#ring-grad-2)" 
          strokeWidth="1.5" 
          strokeDasharray="8 4"
          className="animate-[spin_25s_linear_infinite]"
        />
      </svg>

      {/* Chromatic Voxel Particles */}
      {[
        { c: '#00ffff', d: 0, t: 4, dist: 95, type: 'cube' as const },
        { c: '#ff00ff', d: 1, t: 5, dist: 80, type: 'x' as const },
        { c: '#fbbf24', d: 2, t: 3.5, dist: 110, type: 'cube' as const },
        { c: '#ffffff', d: 0.5, t: 6, dist: 85, type: 'x' as const },
        { c: '#4ade80', d: 1.5, t: 4.5, dist: 100, type: 'cube' as const },
        { c: '#00ffff', d: 3, t: 5, dist: 70, type: 'x' as const },
      ].map((p, i) => (
        <div key={i} className="absolute inset-0 flex items-center justify-center rotate-[calc(var(--index)*60deg)]" style={{ '--index': i } as any}>
          <ChromaticVoxel color={p.c} delay={p.d} duration={p.t} distance={p.dist} type={p.type} />
        </div>
      ))}

      {/* Central 3D Core */}
      <div className="absolute z-10 transition-all duration-700 hover:scale-110 drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]">
        <div className="relative">
          <div className="absolute inset-0 bg-white/25 blur-2xl rounded-full scale-90 animate-pulse" />
          <Premium3DEmoji type="happy" size={90} />
        </div>
      </div>
      
      {/* Orbiting Sentiment Nodes */}
      <div className="absolute w-full h-full flex items-center justify-center animate-[spin_12s_linear_infinite]">
        <div className="absolute top-0 transform -translate-y-1/2 flex flex-col items-center gap-1">
           <div className="bg-black/80 p-1.5 rounded-full backdrop-blur-lg border-2 border-emerald-500/40 shadow-2xl hover:scale-125 transition-transform animate-[spin_12s_linear_infinite_reverse]">
             <Premium3DEmoji type="happy" size={34} />
           </div>
        </div>
      </div>
      
      <div className="absolute w-full h-full flex items-center justify-center animate-[spin_16s_linear_infinite_reverse]">
        <div className="absolute left-0 transform -translate-x-1/2 flex items-center gap-1">
           <div className="bg-black/80 p-1.5 rounded-full backdrop-blur-lg border-2 border-amber-500/40 shadow-2xl hover:scale-125 transition-transform animate-[spin_16s_linear_infinite]">
             <Premium3DEmoji type="neutral" size={34} />
           </div>
        </div>
      </div>
      
      <div className="absolute w-full h-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
        <div className="absolute bottom-0 transform translate-y-1/2 flex flex-col items-center gap-1">
           <div className="bg-black/80 p-1.5 rounded-full backdrop-blur-lg border-2 border-rose-500/40 shadow-2xl hover:scale-125 transition-transform animate-[spin_20s_linear_infinite_reverse]">
             <Premium3DEmoji type="sad" size={34} />
           </div>
        </div>
      </div>

      <style>{`
        @keyframes chromaticFloat {
          0% { transform: rotate(0deg) translateX(var(--distance)) scale(0.5); opacity: 0; }
          20% { opacity: 0.9; scale(1); }
          80% { opacity: 0.9; scale(1); }
          100% { transform: rotate(360deg) translateX(calc(var(--distance) + 30px)) scale(0); opacity: 0; }
        }
        .rotate-x-65 {
          transform: perspective(600px) rotateX(65deg);
        }
      `}</style>
    </div>
  );
};
