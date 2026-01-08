// src/main/resources/FrontEnd/components/PartyPopperGlitter.tsx
import React from 'react';

interface PartyPopperGlitterProps {
  duration?: number; // Animation duration in seconds
  offsetTransformX?: number; // Base offset for the whole glitter container
  offsetTransformY?: number; // Base offset for the whole glitter container
  animationDelay?: number; // Delay before the whole component's animation starts (in seconds)
  isSunBurst?: boolean; // If true, create a larger, sun-shaped burst effect
  containerWidth?: number; // Custom width for the glitter container
  containerHeight?: number; // Custom height for the glitter container
}

const PartyPopperGlitter: React.FC<PartyPopperGlitterProps> = ({ 
  duration = 1.5, 
  offsetTransformX = 100, 
  offsetTransformY = -50,
  animationDelay = 0,
  isSunBurst = false,
  containerWidth,
  containerHeight
}) => {
  const colors = ['#10b981', '#34d399', '#fbbf24', '#fef3c7', '#d1fae5'];
  
  const numberOfParticles = isSunBurst ? 60 : 40; // More particles for sun burst
  const spreadDistance = isSunBurst ? 150 + Math.random() * 50 : 80 + Math.random() * 20; // Larger spread for sun burst
  const baseDuration = isSunBurst ? 2.5 : duration; // Longer base duration for sun burst

  const particles = Array.from({ length: numberOfParticles }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distance = spreadDistance * (0.8 + Math.random() * 0.2); // Vary distance slightly
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;
    
    // Vary size more for sun burst
    const particleSizeClass = isSunBurst 
      ? (Math.random() > 0.6 ? 'w-2 h-2' : 'w-3 h-3') 
      : (Math.random() > 0.7 ? 'w-1 h-1' : 'w-2 h-2'); 
    
    const randomDuration = baseDuration * (0.8 + Math.random() * 0.4); // Vary duration for each particle

    return (
      <div
        key={i}
        className={`absolute ${particleSizeClass} rounded-sm`} // squared particles, varied size
        style={{
          animation: `party-popper-glitter ${randomDuration}s linear infinite ${animationDelay + i * 0.03}s`, // Adjusted delay
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

  const finalContainerWidth = containerWidth || (isSunBurst ? 128 : 96); // 128px for w-32, 96px for w-24
  const finalContainerHeight = containerHeight || (isSunBurst ? 128 : 96);

  return (
    <div 
      className="absolute pointer-events-none overflow-hidden" 
      style={{ 
        top: '50%', 
        left: '50%', 
        width: `${finalContainerWidth}px`, 
        height: `${finalContainerHeight}px`,
        transform: `translate(${offsetTransformX}px, ${offsetTransformY}px)` 
      }}
    >
      {particles}
    </div>
  );
};

export default PartyPopperGlitter;