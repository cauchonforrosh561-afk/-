import React, { useEffect, useRef } from 'react';

interface BallpitProps {
  count?: number;
  gravity?: number; // unused in mist system but kept for signature compatibility
  followCursor?: boolean;
  colors?: string[]; // fallback colors if needed
}

interface AromaMolecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  alpha: number;
  pulseAngle: number;
  pulseSpeed: number;
  swaySpeed: number;
  swayAngle: number;
  swayRange: number;
  driftSpeed: number;
  label: string;
  labelOpacity: number;
}

interface ClickWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const AROMA_LABELS = [
  '香草草本 (Vanilla)',
  '醇厚可可 (Rich Cocoa)',
  '多汁莓果 (Tangy Berry)',
  '深邃榛果 (Toasted Nut)',
  '花蜜清甜 (Honey Nectar)',
  '新西兰奶香 (Milky Way)',
  '香橙精油 (Citrus Dew)',
  '清心薄荷 (Wild Mint)'
];

const FLAVOR_PALETTE = [
  { base: 'rgba(255, 245, 230, 0.75)', glow: 'rgba(255, 200, 150, 0.9)' }, // Vanilla Ivory
  { base: 'rgba(202, 138, 4, 0.6)', glow: 'rgba(253, 224, 71, 0.85)' },    // Honey Gold
  { base: 'rgba(244, 63, 94, 0.6)', glow: 'rgba(254, 205, 211, 0.85)' },   // Strawberry Pink
  { base: 'rgba(120, 53, 4, 0.65)', glow: 'rgba(180, 83, 9, 0.8)' },       // Warm Cocoa Brown
  { base: 'rgba(74, 222, 128, 0.55)', glow: 'rgba(187, 247, 208, 0.8)' },  // Pistachio Green
  { base: 'rgba(14, 165, 233, 0.55)', glow: 'rgba(186, 230, 253, 0.8)' }   // Wild Mint Sky
];

export default function Ballpit({
  count = 42,
  colors // matching original props signature
}: BallpitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null; lastX: number | null; lastY: number | null; vx: number; vy: number }>({
    x: null,
    y: null,
    lastX: null,
    lastY: null,
    vx: 0,
    vy: 0
  });

  const clickWavesRef = useRef<ClickWave[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: AromaMolecule[] = [];

    // Factory to construct a single aroma particle
    const createAromaParticle = (initialY: number = -1): AromaMolecule => {
      const pIndex = Math.floor(Math.random() * FLAVOR_PALETTE.length);
      const palette = FLAVOR_PALETTE[pIndex];
      const baseRadius = Math.random() * 8 + 8; // 8px to 16px base size
      const labelValue = Math.random() < 0.25 ? AROMA_LABELS[Math.floor(Math.random() * AROMA_LABELS.length)] : '';

      return {
        x: Math.random() * width,
        y: initialY === -1 ? Math.random() * (height + 40) : initialY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0,
        radius: baseRadius,
        baseRadius,
        color: palette.base,
        glowColor: palette.glow,
        alpha: Math.random() * 0.4 + 0.35, // nice soft transparency
        pulseAngle: Math.random() * Math.PI,
        pulseSpeed: 0.015 + Math.random() * 0.015,
        swaySpeed: 0.008 + Math.random() * 0.01,
        swayAngle: Math.random() * Math.PI * 2,
        swayRange: Math.random() * 0.4 + 0.3, // pixels sway
        driftSpeed: 0.35 + Math.random() * 0.6, // gentle speed climbing upwards
        label: labelValue,
        labelOpacity: Math.random() * 0.4 + 0.2
      };
    };

    // Initialize initial set of climbing aroma particles
    const initParticles = () => {
      const list: AromaMolecule[] = [];
      for (let i = 0; i < count; i++) {
        list.push(createAromaParticle());
      }
      return list;
    };

    particles = initParticles();

    let animationId: number;

    const renderLoop = () => {
      // Create trailing motion smear layer for fluid organic warmth
      ctx.fillStyle = 'rgba(255, 252, 251, 0.12)';
      ctx.fillRect(0, 0, width, height);

      const m = mouseRef.current;
      
      // Calculate mouse velocity for interactive wind trails
      if (m.x !== null && m.y !== null && m.lastX !== null && m.lastY !== null) {
        m.vx = m.x - m.lastX;
        m.vy = m.y - m.lastY;
        // Damp mouse velocity
        m.vx *= 0.9;
        m.vy *= 0.9;
      } else {
        m.vx = 0;
        m.vy = 0;
      }
      m.lastX = m.x;
      m.lastY = m.y;

      // 1. Render and expand click ripples (scent explosions)
      clickWavesRef.current.forEach((wave, wIdx) => {
        wave.radius += (wave.maxRadius - wave.radius) * 0.08;
        wave.alpha *= 0.93;

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(108, 47, 0, ${wave.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner glowing golden halo
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 119, 6, ${wave.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (wave.alpha < 0.01) {
          clickWavesRef.current.splice(wIdx, 1);
        }
      });

      // 2. Physics & Draw for aroma molecule particles
      particles.forEach((p) => {
        // A. Rising and swaying movement
        p.pulseAngle += p.pulseSpeed;
        p.swayAngle += p.swaySpeed;

        // Apply a breathing pulse to radius for lively look
        p.radius = p.baseRadius + Math.sin(p.pulseAngle) * 2;

        // Floating upwards drifting speed
        p.y -= p.driftSpeed;
        // Sway sideways horizontally with sine wave noise
        p.x += Math.sin(p.swayAngle) * p.swayRange;

        // B. Mouse interaction: Gravity-free fluid currents and Vortex influence
        if (m.x !== null && m.y !== null) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const dist = Math.hypot(dx, dy);
          const activeRadius = 110;

          if (dist < activeRadius) {
            const force = (activeRadius - dist) / activeRadius;
            
            // 1) Vortex/swirling circular drag
            const angle = Math.atan2(dy, dx);
            const orbitStrength = 0.8;
            // Swirl sideways based on distance
            p.vx += -Math.sin(angle) * orbitStrength * force;
            p.vy += Math.cos(angle) * orbitStrength * force;

            // 2) Attraction or push relative to mouse velocity
            p.vx += m.vx * 0.08 * force;
            p.vy += m.vy * 0.08 * force;

            // Gather slightly towards the center of mouse pointer for physical magnetic bonding feel
            p.vx -= (dx / dist) * 0.12 * force;
            p.vy -= (dy / dist) * 0.12 * force;
          }
        }

        // Apply friction to the interactive velocities
        p.vx *= 0.94;
        p.vy *= 0.94;

        p.x += p.vx;
        p.y += p.vy;

        // C. Bound check: Reset to bottom if drifted off-screen
        if (p.y < -30) {
          p.y = height + Math.random() * 30 + 10;
          p.x = Math.random() * width;
          p.vx = (Math.random() - 0.5) * 0.8;
          p.vy = 0;
        }

        // Bound check: Keep horizontal coordinates inside canvas boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        // D. Push away from expanding click waves
        clickWavesRef.current.forEach((wave) => {
          const dx = p.x - wave.x;
          const dy = p.y - wave.y;
          const dist = Math.hypot(dx, dy);
          if (dist < wave.radius && dist > 1) {
            const pushForce = (1 - dist / wave.radius) * 4;
            p.x += (dx / dist) * pushForce;
            p.y += (dy / dist) * pushForce;
          }
        });

        // E. Draw elegant aroma particle glowing visual structure
        const gradient = ctx.createRadialGradient(
          p.x, p.y, p.radius * 0.1,
          p.x, p.y, p.radius
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.35, p.glowColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        // Ambient glass molecular aura fill
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core solid glowing lens
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.glowColor;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow state

        // Delicate orbital highlight ring around scent particles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 1.1, 0, Math.PI * 2);
        ctx.strokeStyle = p.glowColor;
        ctx.lineWidth = 0.55;
        ctx.stroke();

        // Little dynamic sparkling light specks
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.25, p.y - p.radius * 0.25, p.radius * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // F. Draw elegant tiny text labels for specific particles to emphasize scent/aroma theme
        if (p.label) {
          ctx.font = '500 9px font-sans, system-ui, sans-serif';
          ctx.fillStyle = `rgba(108, 47, 0, ${p.labelOpacity})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.label, p.x, p.y - p.radius - 8);

          // Connective dotted tiny line
          ctx.beginPath();
          ctx.setLineDash([1, 2]);
          ctx.moveTo(p.x, p.y - p.radius - 3);
          ctx.lineTo(p.x, p.y - p.radius + 1);
          ctx.strokeStyle = `rgba(108, 47, 0, ${p.labelOpacity * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.setLineDash([]); // clear dash state
        }
      });

      animationId = requestAnimationFrame(renderLoop);
    };

    animationId = requestAnimationFrame(renderLoop);

    // Track component bounds on resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = entry.contentRect.width || container.clientWidth;
        height = entry.contentRect.height || container.clientHeight;
        canvas.width = width;
        canvas.height = height;
      }
    });

    resizeObserver.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    // Clicking spawns a lovely scent ripple wave
    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Add temporary wave
      clickWavesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 4,
        maxRadius: Math.random() * 50 + 80,
        alpha: 0.8
      });

      // Boost particles in click range with outward bursts
      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 1) {
          const strength = (120 - dist) / 120;
          p.vx += (dx / dist) * strength * 11;
          p.vy += (dy / dist) * strength * 11;
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleMouseClick);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleMouseClick);
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto bg-transparent z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
