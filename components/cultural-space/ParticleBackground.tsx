"use client";
import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Subtle gold and white colors
    const colors = [
      'rgba(212, 175, 55, 0.4)', // subtle gold
      'rgba(234, 179, 8, 0.5)',  // bright mini gold
      'rgba(255, 255, 255, 0.5)', // white translucent
      'rgba(255, 255, 255, 0.3)', // fainter white
      'rgba(212, 175, 55, 0.2)'  // background gold halo
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulseSpeed: number;
      pulseAngle: number;
      baseOpacity: number;
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000)); // Adaptive count based on screen size

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        // Drifts very slowly (v ≈ 0.3 - 0.6 px/s)
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.4, // Upward slow drift
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulseAngle: Math.random() * Math.PI,
        baseOpacity: 0.3 + Math.random() * 0.6,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark navy / gold horizon gradient background overlay to build atmosphere
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020617'); // slate-950 extremely dark navy
      bgGrad.addColorStop(0.5, '#070f2b'); // dark royal blue-black
      bgGrad.addColorStop(1, '#020617'); // slate-950
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle dynamic golden glow at the bottom center
      const radialGlow = ctx.createRadialGradient(
        width / 2, height, 10,
        width / 2, height, Math.max(width * 0.6, 600)
      );
      radialGlow.addColorStop(0, 'rgba(212, 175, 55, 0.06)');
      radialGlow.addColorStop(0.5, 'rgba(7, 15, 43, 0)');
      radialGlow.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulseAngle += p.pulseSpeed;

        // Wrap around screens nicely
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Modulate opacity for a organic Breathing effect
        const alpha = p.baseOpacity * (0.6 + Math.sin(p.pulseAngle) * 0.4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
        ctx.shadowBlur = p.radius * 2;
        ctx.fill();
        ctx.shadowBlur = 0; // reset for performance
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="exhibition-particle-background"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

