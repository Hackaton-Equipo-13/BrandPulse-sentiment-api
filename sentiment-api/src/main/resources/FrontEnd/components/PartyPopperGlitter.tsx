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
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distance = Math.random() * 80 + 20; // Distance from center, 20-100px
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;

    return (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          animation: `party-popper-glitter ${duration}s linear infinite ${i * 0.05}s`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)', // Center the particle initially
          '--translate-x': `${translateX}px`, // CSS variable for animation
          '--translate-y': `${translateY}px`, // CSS variable for animation
          backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`, // Random color
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