
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  velocity: number;
  life: number;
}

const DivineParticles: React.FC<{ active: boolean }> = ({ active }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: Math.random() + i,
        x: 50,
        y: 50,
        size: Math.random() * 4 + 2,
        color: i % 2 === 0 ? '#fbbf24' : '#ffffff',
        angle: Math.random() * Math.PI * 2,
        velocity: Math.random() * 5 + 2,
        life: 1,
      }));
      setParticles(newParticles);
    }
  }, [active]);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.velocity,
            y: p.y + Math.sin(p.angle) * p.velocity,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full shadow-[0_0_10px_currentColor]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            color: p.color,
            opacity: p.life,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
    </div>
  );
};

export default DivineParticles;
