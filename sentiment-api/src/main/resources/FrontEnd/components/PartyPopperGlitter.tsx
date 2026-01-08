// src/main/resources/FrontEnd/components/PartyPopperGlitter.tsx
import React from 'react';

interface PartyPopperGlitterProps {
  duration?: number; // Animation duration in seconds
  offsetTransformX?: number; // Base offset for the whole glitter container
  offsetTransformY?: number; // Base offset for the whole glitter container
}

const PartyPopperGlitter: React.FC<PartyPopperGlitterProps> = ({ 
  duration = 1.5, 
  offsetTransformX = 100, 
  offsetTransformY = -50 
}) => {
  const colors = ['#10b981', '#34d399', '#fbbf24', '#fef3c7', '#d1fae5'];
  const numberOfParticles = 40; // Increased number of particles

  const particles = Array.from({ length: numberOfParticles }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distance = Math.random() * 80 + 20; // Distance from center, 20-100px
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;
    const particleSizeClass = Math.random() > 0.7 ? 'w-1 h-1' : 'w-2 h-2'; // Some particles are smaller
    const randomDuration = duration * (0.8 + Math.random() * 0.4); // Vary duration for each particle

    return (
      <div
        key={i}
        className={`absolute ${particleSizeClass} rounded-sm`} // squared particles, varied size
        style={{
          animation: `party-popper-glitter ${randomDuration}s linear infinite ${i * 0.03}s`, // Adjusted delay
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)', // Center the particle initially
          '--translate-x': `${translateX}px`, // CSS variable for animation
          '--translate-y': `${translateY}px`, // CSS variable for animation
          backgroundColor: colors[Math.floor(Math.random() * colors.length)], // Random color from palette
        } as React.CSSProperties} // Cast to CSSProperties for custom properties
      />
    );
  });

  return (
    <div 
      className="absolute w-24 h-24 pointer-events-none overflow-hidden" 
      style={{ top: '50%', left: '50%', transform: `translate(${offsetTransformX}px, ${offsetTransformY}px)` }}
    >
      {particles}
    </div>
  );
};

export default PartyPopperGlitter;