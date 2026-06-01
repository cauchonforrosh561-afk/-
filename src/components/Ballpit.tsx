import React, { useEffect, useRef } from 'react';

interface BallpitProps {
  count?: number;
  gravity?: number;
  followCursor?: boolean;
  colors?: string[];
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  mass: number;
}

export default function Ballpit({
  count = 50,
  gravity = 0.01,
  followCursor = false,
  colors = ['#5227FF', '#7cff67', '#ff6b6b', '#ffffff', '#ffffff', '#ffffff']
}: BallpitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

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

    let balls: Ball[] = [];

    // Initialize random balls with spread
    const initBalls = (w: number, h: number) => {
      const list: Ball[] = [];
      for (let i = 0; i < count; i++) {
        const radius = Math.floor(Math.random() * 8) + 12; // 12px to 20px radius
        const color = colors[Math.floor(Math.random() * colors.length)];
        list.push({
          x: Math.random() * (w - radius * 2) + radius,
          y: Math.random() * (h / 2 - radius * 2) + radius, // drop on upper half
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 2,
          radius,
          color,
          mass: radius // direct proportional mass
        });
      }
      return list;
    };

    balls = initBalls(width, height);

    // Track state to handle animation loop
    let animationId: number;

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse interactive constraints
      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      const mouseRepulsionRadius = 65;
      const mouseRepelPower = 0.25;

      // 1. Physics update phase
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        // Apply constant gravity vector
        b.vy += gravity;

        // Apply light fluid air viscosity friction/drag
        b.vx *= 0.985;
        b.vy *= 0.985;

        // Apply position translation step
        b.x += b.vx;
        b.y += b.vy;

        // Boundary constraints collision check
        // Floor crash
        if (b.y + b.radius > height) {
          b.y = height - b.radius;
          b.vy = -Math.abs(b.vy) * 0.72; // floor restitution coefficient
          b.vx *= 0.95; // floor friction draft
        }
        // Ceiling crash
        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy = Math.abs(b.vy) * 0.72;
        }
        // Left wall crash
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = Math.abs(b.vx) * 0.72;
        }
        // Right wall crash
        if (b.x + b.radius > width) {
          b.x = width - b.radius;
          b.vx = -Math.abs(b.vx) * 0.72;
        }

        // Mouse kinetic repulsion forces/attraction
        if (mX !== null && mY !== null) {
          const dx = b.x - mX;
          const dy = b.y - mY;
          const dist = Math.hypot(dx, dy);

          if (followCursor) {
            // Strong attraction hook
            b.vx += (dx < 0 ? 1 : -1) * 0.08;
            b.vy += (dy < 0 ? 1 : -1) * 0.08;
          } else {
            // Push-back repulsion when mouse is near
            if (dist < mouseRepulsionRadius + b.radius) {
              const force = (mouseRepulsionRadius + b.radius - dist) / (mouseRepulsionRadius + b.radius);
              const angle = Math.atan2(dy, dx);
              b.vx += Math.cos(angle) * force * mouseRepelPower * 8;
              b.vy += Math.sin(angle) * force * mouseRepelPower * 8;
            }
          }
        }
      }

      // 2. Ball-to-ball elastic collisions (staggered double checker)
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i];
          const b2 = balls[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b1.radius + b2.radius;

          if (dist < minDist) {
            // Overlapping resolved by moving away along normal vector
            const overlap = minDist - dist;
            const normX = dx / dist;
            const normY = dy / dist;

            b1.x -= normX * overlap * 0.5;
            b1.y -= normY * overlap * 0.5;
            b2.x += normX * overlap * 0.5;
            b2.y += normY * overlap * 0.5;

            // Elastic 2D vector calculation
            // Relative velocity
            const rvx = b2.vx - b1.vx;
            const rvy = b2.vy - b1.vy;

            // Velocity projection along normal (impact speed)
            const speedAlongNormal = rvx * normX + rvy * normY;

            // Only collides if moving towards each other
            if (speedAlongNormal < 0) {
              const restitution = 0.8; // Bounciness factor of individual balls
              const impulseScalar = -(1 + restitution) * speedAlongNormal / (1/b1.mass + 1/b2.mass);

              // Apply impulse vector
              b1.vx -= (impulseScalar / b1.mass) * normX;
              b1.vy -= (impulseScalar / b1.mass) * normY;
              b2.vx += (impulseScalar / b2.mass) * normX;
              b2.vy += (impulseScalar / b2.mass) * normY;
            }
          }
        }
      }

      // 3. Render and draw phase
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        // Premium outline shading for luxurious visual consistency
        ctx.strokeStyle = '#2c160e';
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // High gloss luxury 3D reflections highlight
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();
      }

      animationId = requestAnimationFrame(updateAndDraw);
    };

    animationId = requestAnimationFrame(updateAndDraw);

    // ResizeObserver tracks container layout changes dynamically
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = entry.contentRect.width || container.clientWidth;
        height = entry.contentRect.height || container.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // Gently keep balls in bounds on resize adjustments
        balls.forEach((b) => {
          if (b.x + b.radius > width) b.x = width - b.radius;
          if (b.y + b.radius > height) b.y = height - b.radius;
        });
      }
    });

    resizeObserver.observe(container);

    // Mouse interactive event hooks
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [count, gravity, followCursor, colors]);

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
