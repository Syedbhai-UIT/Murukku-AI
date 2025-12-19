import React from 'react';

const ParticleBackground: React.FC = () => {
  // Create an array of particles with random properties
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 15}s`,
    duration: `${15 + Math.random() * 10}s`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-accent rounded-full opacity-30 animate-float"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
