import { useEffect, useRef } from 'react';

interface ClickSparkProps {
  duration?: number;
  sparkColor?: string;
  sparkSize?: number;
  sparkCount?: number;
  easing?: string;
}

export default function ClickSpark({
  duration = 850
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const parent = container.parentElement;
    if (!parent) return;

    // Use absolute/fixed container context
    const originalPosition = parent.style.position;
    if (!originalPosition || originalPosition === 'static') {
      parent.style.position = 'relative';
    }

    const iceCreamSVGs = [
      // 1. Premium Double Scoop Cone
      `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%; filter: drop-shadow(0 3px 6px rgba(108, 47, 0, 0.2));">
        <!-- Cone -->
        <path d="M 34 54 L 50 88 L 66 54 Z" fill="#e4b58c" stroke="#542e12" stroke-width="5" stroke-linejoin="round" />
        <path d="M 39 54 L 50 88 M 44 54 L 50 88 M 56 54 L 50 88" stroke="#bc8558" stroke-width="2.5" />
        <!-- Bottom Scoop -->
        <circle cx="50" cy="48" r="18" fill="#ffebd3" stroke="#542e12" stroke-width="5" />
        <!-- Top Cherry Scoop -->
        <circle cx="50" cy="30" r="14" fill="#ff8ba1" stroke="#542e12" stroke-width="5" />
        <!-- Cherry Stem -->
        <path d="M 50 16 C 50 11, 56 7, 61 10" stroke="#542e12" stroke-width="4" stroke-linecap="round" fill="none" />
        <!-- Cherry -->
        <circle cx="50" cy="16" r="4.5" fill="#ef4444" />
      </svg>`,

      // 2. Strawberry Sprinkles Popsicle
      `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%; filter: drop-shadow(0 3px 6px rgba(108, 47, 0, 0.2));">
        <!-- Stick -->
        <rect x="44" y="65" width="12" height="22" rx="5" fill="#e0b894" stroke="#542e12" stroke-width="5" />
        <!-- Ice Cream Bar -->
        <path d="M 32 65 L 32 28 C 32 16, 40 14, 50 14 C 60 14, 68 16, 68 28 L 68 65 Z" fill="#ffe2d1" stroke="#542e12" stroke-width="5" stroke-linejoin="round" />
        <!-- Strawberry Dip glaze on top -->
        <path d="M 32 36 C 36 39, 42 34, 50 37 C 58 34, 64 39, 68 36 L 68 28 C 68 16, 60 14, 50 14 C 40 14, 32 16, 32 28 Z" fill="#ff6b8b" stroke="#542e12" stroke-width="5" />
        <!-- Sprinkles -->
        <line x1="40" y1="23" x2="46" y2="23" stroke="#4ade80" stroke-width="5" stroke-linecap="round" />
        <line x1="53" y1="26" x2="59" y2="23" stroke="#fdba74" stroke-width="5" stroke-linecap="round" />
      </svg>`,

      // 3. Gourmet Glass Sundae Cup
      `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%; filter: drop-shadow(0 3px 6px rgba(108, 47, 0, 0.2));">
        <!-- Cup base -->
        <path d="M 26 36 L 33 70 L 67 70 L 74 36 Z" fill="#ffffff" stroke="#542e12" stroke-width="5" stroke-linejoin="round" />
        <!-- Foot of the cup -->
        <path d="M 40 70 L 35 88 L 65 88 L 60 70 Z" fill="#e2e8f0" stroke="#542e12" stroke-width="5" stroke-linejoin="round" />
        <!-- Ice cream scoops -->
        <circle cx="40" cy="34" r="15" fill="#fdba74" stroke="#542e12" stroke-width="5" />
        <circle cx="60" cy="34" r="15" fill="#feca57" stroke="#542e12" stroke-width="5" />
        <circle cx="50" cy="24" r="14" fill="#ffe2db" stroke="#542e12" stroke-width="5" />
        <!-- Cherry top -->
        <circle cx="50" cy="10" r="4.5" fill="#ef4444" />
      </svg>`
    ];

    const handleClick = (e: MouseEvent) => {
      // Create a master click canvas wrapper element at mouse point
      const effectWrapper = document.createElement('div');
      effectWrapper.style.position = 'fixed';
      effectWrapper.style.pointerEvents = 'none';
      effectWrapper.style.width = '60px';
      effectWrapper.style.height = '60px';
      effectWrapper.style.zIndex = '99999';

      const x = e.clientX - 30;
      const y = e.clientY - 30;

      effectWrapper.style.left = `${x}px`;
      effectWrapper.style.top = `${y}px`;

      // 1. Spawns central randomized ice cream graphic
      const iceCreamDiv = document.createElement('div');
      iceCreamDiv.style.position = 'absolute';
      iceCreamDiv.style.inset = '0';
      iceCreamDiv.style.display = 'flex';
      iceCreamDiv.style.alignItems = 'center';
      iceCreamDiv.style.justifyContent = 'center';

      const randomSVG = iceCreamSVGs[Math.floor(Math.random() * iceCreamSVGs.length)];
      iceCreamDiv.innerHTML = randomSVG;

      effectWrapper.appendChild(iceCreamDiv);

      // 2. Spawns 4 surrounding golden & coral magic sparkle dots
      const colors = ['#fbcfe8', '#fdba74', '#fed7aa', '#f9a8d4'];
      const particles: HTMLDivElement[] = [];

      for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.floor(Math.random() * 4) + 8}px`;
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = colors[i % colors.length];
        particle.style.border = '2px solid #542e12';
        particle.style.left = '26px';
        particle.style.top = '26px';
        effectWrapper.appendChild(particle);
        particles.push(particle);
      }

      container.appendChild(effectWrapper);

      // Animate the main ice cream graphic with custom elastic/float pop
      const randomRotate = Math.floor(Math.random() * 20) - 10; // -10deg to 10deg
      iceCreamDiv.animate(
        [
          { transform: `scale(0) translateY(10px) rotate(${randomRotate - 10}deg)`, opacity: 0 },
          { transform: `scale(1.15) translateY(-5px) rotate(${randomRotate}deg)`, opacity: 1, offset: 0.25 },
          { transform: `scale(1) translateY(-10px) rotate(${randomRotate}deg)`, opacity: 1, offset: 0.5 },
          { transform: `scale(0.8) translateY(-40px) rotate(${randomRotate + 15}deg)`, opacity: 0 }
        ],
        {
          duration: duration,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          fill: 'forwards'
        }
      );

      // Animate small sparkles exploding outward in four directions
      const angleStep = 360 / particles.length;
      particles.forEach((part, idx) => {
        const angle = (idx * angleStep) + Math.random() * 15;
        const rad = (angle * Math.PI) / 180;
        const dist = Math.floor(Math.random() * 20) + 35; // 35px to 55px radius
        const targetX = Math.cos(rad) * dist;
        const targetY = Math.sin(rad) * dist;

        part.animate(
          [
            { transform: 'translate(0, 0) scale(0.2)', opacity: 0 },
            { transform: `translate(${targetX * 0.4}px, ${targetY * 0.4}px) scale(1.1)`, opacity: 1, offset: 0.2 },
            { transform: `translate(${targetX}px, ${targetY}px) scale(0)`, opacity: 0 }
          ],
          {
            duration: duration - 100,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards'
          }
        );
      });

      // Clear layout nodes upon completion
      setTimeout(() => {
        if (container.contains(effectWrapper)) {
          container.removeChild(effectWrapper);
        }
      }, duration);
    };

    parent.addEventListener('click', handleClick);

    return () => {
      parent.removeEventListener('click', handleClick);
      if (originalPosition) {
        parent.style.position = originalPosition;
      } else {
        parent.style.removeProperty('position');
      }
    };
  }, [duration]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 9999
      }}
    />
  );
}
