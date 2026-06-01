import React, { useEffect, useRef, useId } from 'react';

interface LightRaysProps {
  lightSpread?: number; // 0.1 to 1.0 (default 0.5) - controls spacing/angle
  rayLength?: number;   // 1.0 to 5.0 (default 3.0) - scale of ray length
  raysColor?: string;   // hex (default 'fbf0f0')
  rayOpacity?: number;  // overall transparency (default 0.15)
  speed?: number;       // speed of shimmer & rotation (default 0.002)
  animated?: boolean;   // default true
  originX?: number;     // 0 to 1 (default 0.5, i.e., horizontal center)
  originY?: number;     // 0 to 1 (default -0.1, i.e., slightly above top boundary)
}

export default function LightRays({
  lightSpread = 0.5,
  rayLength = 3.0,
  raysColor = 'fbf0f0',
  rayOpacity = 0.15,
  speed = 0.002,
  animated = true,
  originX = 0.5,
  originY = -0.1,
}: LightRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const id = useId();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Parse color hex directly to RGB
    const hex = raysColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 251;
    const g = parseInt(hex.substring(2, 4), 16) || 240;
    const b = parseInt(hex.substring(4, 6), 16) || 240;

    // Generating slow, organic waving light rays
    const numRays = 24;
    const rays: {
      angle: number;
      width: number;
      speed: number;
      opacityMultiplier: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < numRays; i++) {
      const centerAngle = Math.PI / 2; // Face straight down
      const maxSpreadAngle = Math.PI * 0.8 * lightSpread;
      const ratio = numRays > 1 ? i / (numRays - 1) : 0.5;
      const angle = centerAngle + (ratio - 0.5) * maxSpreadAngle;

      rays.push({
        angle,
        width: (0.015 + Math.random() * 0.025) * lightSpread,
        speed: (0.0002 + Math.random() * 0.0006) * (animated ? 1 : 0),
        opacityMultiplier: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Adapt to parent element resize automatically
    const handleResize = () => {
      const parent = containerRef.current;
      if (!parent || !canvas) return;
      width = parent.clientWidth;
      height = parent.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    handleResize();

    let lastTime = 0;
    const tick = (time: number) => {
      const delta = lastTime === 0 ? 0 : time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Anchoring origin coordinates on top-center
      const ox = width * originX;
      const oy = height * originY;

      // Ensure length matches rayLength modifier
      const maxRadius = Math.max(width, height) * rayLength;

      // Paint individual shimmer rays
      rays.forEach((ray, index) => {
        if (animated) {
          ray.phase += delta * speed * 0.1;
          ray.angle += Math.sin(ray.phase) * ray.speed * 0.2;
        }

        const shimmer = Math.sin(ray.phase + index) * 0.25 + 0.75;
        const currentOpacity = rayOpacity * ray.opacityMultiplier * shimmer;

        // Custom linear-to-radial translucent shading
        const grad = ctx.createRadialGradient(ox, oy, 10, ox, oy, maxRadius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentOpacity})`);
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.45})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        const leftAngle = ray.angle - ray.width / 2;
        const rightAngle = ray.angle + ray.width / 2;

        const x1 = ox + Math.cos(leftAngle) * maxRadius;
        const y1 = oy + Math.sin(leftAngle) * maxRadius;

        const x2 = ox + Math.cos(rightAngle) * maxRadius;
        const y2 = oy + Math.sin(rightAngle) * maxRadius;

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
      });

      // Warm ambient radial spot at the center
      const ambientGrad = ctx.createRadialGradient(ox, oy, 5, ox, oy, Math.min(width, height) * 0.7);
      ambientGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${rayOpacity * 0.85})`);
      ambientGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(ox, oy, Math.min(width, height) * 0.7, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [lightSpread, rayLength, raysColor, rayOpacity, speed, animated, originX, originY]);

  return (
    <div 
      ref={containerRef} 
      id={id}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 select-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
