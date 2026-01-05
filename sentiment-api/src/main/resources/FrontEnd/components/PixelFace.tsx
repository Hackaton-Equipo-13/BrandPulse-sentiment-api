
import React, { useEffect, useState } from 'react';
import { SentimentType } from '../types';

interface PixelFaceProps {
  type: SentimentType;
  percentage: number;
  breakdown?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  size?: number;
  isNeon?: boolean;
}

export const PixelFace: React.FC<PixelFaceProps> = ({ type, percentage, breakdown, size = 180, isNeon }) => {
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const count = Math.floor(percentage / 1.5); 
    const newParticles = Array.from({ length: count }).map(() => ({
      x: 20 + Math.random() * 60,
      y: 85 - Math.random() * (percentage * 0.7), 
      delay: Math.random() * 3,
      size: 2 + Math.random() * 3,
      duration: 2 + Math.random() * 2
    }));
    setParticles(newParticles);
  }, [percentage, type]);

  const getColors = () => {
    switch (type) {
      case SentimentType.POSITIVE:
        return { base: '#10b981', light: '#34d399', dark: '#064e3b', particles: '#d1fae5', aura: 'rgba(16, 185, 129, 0.4)', accent: '#fbbf24' };
      case SentimentType.NEGATIVE:
        return { base: '#f43f5e', light: '#fb7185', dark: '#4c0519', particles: '#ffe4e6', aura: 'rgba(244, 63, 94, 0.4)', accent: '#60a5fa' };
      default:
        return { base: '#f59e0b', light: '#fbbf24', dark: '#451a03', particles: '#fef3c7', aura: 'rgba(245, 158, 11, 0.4)', accent: '#a855f7' };
    }
  };

  const colors = getColors();

  return (
    <div className="relative flex flex-col items-center justify-center group" style={{ width: size, height: size }}>
      {/* Dynamic Environmental Layer: Cubes, X's and Pixels */}
      <div className="absolute inset-0 pointer-events-none overflow-visible z-0">
        {type === SentimentType.POSITIVE && (
          <div className="absolute inset-[-80px]">
            {Array.from({ length: 15 }).map((_, i) => (
              <React.Fragment key={i}>
                {/* Explosive X's */}
                <div
                  className="absolute font-pixel text-[12px] select-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    color: colors.accent,
                    transformOrigin: 'center',
                    animation: `burstX ${2 + Math.random()}s ease-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: 0
                  }}
                >
                  X
                </div>
                {/* Floating Voxel Cubes */}
                <div
                  className="absolute w-2 h-2"
                  style={{
                    left: '50%',
                    top: '50%',
                    backgroundColor: colors.light,
                    boxShadow: `2px 2px 0px ${colors.dark}`,
                    animation: `burstCube ${1.5 + Math.random()}s ease-out infinite`,
                    animationDelay: `${Math.random() * 1.5}s`,
                    opacity: 0
                  }}
                />
              </React.Fragment>
            ))}
            <style>{`
              @keyframes burstX {
                0% { transform: translate(-50%, -50%) rotate(0deg) scale(0); opacity: 0; }
                20% { opacity: 1; }
                100% { transform: translate(calc(-50% + ${Math.random() * 200 - 100}px), calc(-50% + ${Math.random() * 200 - 100}px)) rotate(${Math.random() * 360}deg) scale(1.5); opacity: 0; }
              }
              @keyframes burstCube {
                0% { transform: translate(-50%, -50%) rotate(0deg) scale(0); opacity: 0; }
                20% { opacity: 1; }
                100% { transform: translate(calc(-50% + ${Math.random() * 160 - 80}px), calc(-50% + ${Math.random() * 160 - 80}px)) rotate(45deg) scale(1.2); opacity: 0; }
              }
            `}</style>
          </div>
        )}

        {type === SentimentType.NEGATIVE && (
          <div className="absolute inset-x-0 top-[-60px] bottom-[-60px] overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-40px',
                  animation: `pixelRain ${0.6 + Math.random() * 0.8}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                {/* Digital Rain Drops */}
                <div className="w-[2px] h-6 bg-rose-400/40 rounded-full mb-1" />
                {Math.random() > 0.8 && <span className="text-[8px] font-pixel text-rose-300/30">X</span>}
              </div>
            ))}
            <style>{`
              @keyframes pixelRain {
                0% { transform: translateY(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(${size + 120}px); opacity: 0; }
              }
            `}</style>
          </div>
        )}

        {type === SentimentType.NEUTRAL && (
          <div className="absolute inset-[-40px] flex items-center justify-center">
            {/* Orbiting Matrix of Shapes */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  animation: `complexOrbit ${8 + i * 2}s linear infinite`,
                  animationDelay: `-${i * 1.2}s`
                }}
              >
                <div 
                  className="w-3 h-3 border-2 flex items-center justify-center"
                  style={{ 
                    borderColor: colors.accent, 
                    transform: `translate(${70 + i * 10}px) rotate(${i * 45}deg)`,
                    backgroundColor: i % 2 === 0 ? 'transparent' : `${colors.accent}22`
                  }}
                >
                  <span className="text-[6px] font-pixel opacity-50">X</span>
                </div>
              </div>
            ))}
            <style>{`
              @keyframes complexOrbit {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative z-10 transition-all duration-700 group-hover:scale-110 drop-shadow-2xl"
      >
        <defs>
          <radialGradient id={`sphere-grad-${type}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="50%" stopColor={colors.base} />
            <stop offset="100%" stopColor={colors.dark} />
          </radialGradient>
          <clipPath id="inner-circle">
            <circle cx="50" cy="50" r="46" />
          </clipPath>
        </defs>

        {/* Outer Halo */}
        <circle cx="50" cy="50" r="49" fill="none" stroke={colors.aura} strokeWidth="1" strokeDasharray="4 2" className="animate-[spin_10s_linear_infinite]" />
        <circle cx="50" cy="50" r="48" fill={colors.aura} className="animate-pulse" />

        {/* 3D Sphere Body */}
        <circle 
          cx="50" cy="50" r="46" 
          fill={`url(#sphere-grad-${type})`} 
          stroke="rgba(255,255,255,0.15)" 
          strokeWidth="0.5"
        />

        {/* Internal Dynamic Pixels */}
        <g clipPath="url(#inner-circle)">
          {particles.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.size}
              height={p.size}
              fill={colors.particles}
              opacity="0.6"
              style={{ 
                animation: `floatUpVoxel ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
          <style>{`
            @keyframes floatUpVoxel {
              0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
              50% { transform: translateY(-15px) scale(1.2); opacity: 0.8; }
            }
          `}</style>
        </g>

        {/* Specular Highlights */}
        <ellipse cx="32" cy="28" rx="12" ry="7" fill="white" fillOpacity="0.45" transform="rotate(-35, 32, 28)" />
        <circle cx="25" cy="25" r="3" fill="white" fillOpacity="0.25" />

        {/* 3D Face */}
        <g transform="translate(0, 2)">
          <circle cx="35" cy="42" r="6" fill="black" fillOpacity="0.12" />
          <circle cx="65" cy="42" r="6" fill="black" fillOpacity="0.12" />
          
          <g fill="#1a1a1a">
            <circle cx="35" cy="41" r="5.5" />
            <circle cx="65" cy="41" r="5.5" />
            <circle cx="33" cy="38.5" r="1.8" fill="white" fillOpacity="0.9" />
            <circle cx="63" cy="38.5" r="1.8" fill="white" fillOpacity="0.9" />
          </g>

          <g fill="none" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round">
            {type === SentimentType.POSITIVE && (
              <path d="M30 58 Q50 80 70 58" />
            )}
            {type === SentimentType.NEGATIVE && (
              <path d="M32 70 Q50 58 68 70" />
            )}
            {type === SentimentType.NEUTRAL && (
              <path d="M34 65 H66" strokeWidth="5" />
            )}
          </g>
        </g>
      </svg>

      {/* Sentiment Tag */}
      <div className={`mt-8 px-6 py-1.5 border-4 ${isNeon ? 'neon-border-cyan bg-black' : 'border-slate-900 bg-white dark:bg-slate-900'} relative z-20 flex items-center gap-3`}>
         <div className="w-2 h-2 bg-current animate-ping" style={{ color: colors.base }} />
         <span className={`font-pixel text-[11px] tracking-widest ${isNeon ? 'text-white' : 'text-current'}`}>
           {type} {percentage.toFixed(0)}%
         </span>
      </div>
    </div>
  );
};
