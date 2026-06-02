import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { HISTORIAL_YEARS } from '../data';
import { playBubbleSound } from '../utils/audio';

export default function HistoricalCarousel() {
  const [activeIndex, setActiveIndex] = useState(1); // Start at 1961 (idx 1) for vintage elegance
  const N = HISTORIAL_YEARS.length;

  // Track 3D tilt angles for the active card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const activeCardRef = useRef<HTMLDivElement>(null);

  // Index Offset Loop minimum distance computation
  const getDiff = (idx: number, currentActive: number) => {
    let diff = idx - currentActive;
    while (diff < -N / 2) diff += N;
    while (diff > N / 2) diff -= N;
    return diff;
  };

  const handlePrev = () => {
    playBubbleSound();
    setActiveIndex((prev) => (prev - 1 + N) % N);
    setTilt({ x: 0, y: 0 }); // reset tilt immediately
  };

  const handleNext = () => {
    playBubbleSound();
    setActiveIndex((prev) => (prev + 1) % N);
    setTilt({ x: 0, y: 0 }); // reset tilt immediately
  };

  // 3D Pointer-based Tilt event handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeCardRef.current) return;
    const rect = activeCardRef.current.getBoundingClientRect();
    
    // Calculate normalized coords relative to center (-1 to 1)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Scale to max ±15 degrees rotation output and update
    setTilt({
      x: -y * 30, // tilt vertically based on mouse Y offset
      y: x * 30   // tilt horizontally based on mouse X offset
    });
  };

  const handleMouseLeave = () => {
    // Return gracefully to horizontal resting position
    setTilt({ x: 0, y: 0 });
  };

  // Automatic touch/click handling for wings to trigger quick focus transition
  const handleCardClick = (idx: number, diff: number) => {
    if (diff !== 0) {
      playBubbleSound();
      setActiveIndex(idx);
      setTilt({ x: 0, y: 0 });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full select-none gap-8 py-6">
      
      {/* 3D Stereoscopic Stage Box */}
      <div 
        className="relative w-full overflow-visible flex items-center justify-center"
        style={{ 
          height: '560px', 
          perspective: '1200px',
          transformStyle: 'preserve-3d'
        }}
      >
        
        {/* Render card loops */}
        {HISTORIAL_YEARS.map((item, idx) => {
          const diff = getDiff(idx, activeIndex);
          const isCenter = diff === 0;
          const isTargetVisible = Math.abs(diff) <= 1;

          // Target configuration based on position specs
          let scale = 1;
          let opacity = 0;
          let translateZ = 0;
          let translateX = 0;
          let rotateYAngle = 0;

          if (isCenter) {
            scale = 1.05;
            opacity = 1;
            translateZ = 50;
            translateX = 0;
            rotateYAngle = 0;
          } else if (diff === -1) {
            scale = 0.85;
            opacity = 0.4;
            translateZ = -100;
            translateX = -280; // Left wing positioning offset
            rotateYAngle = 20; // Soft vintage outward angle
          } else if (diff === 1) {
            scale = 0.85;
            opacity = 0.4;
            translateZ = -100;
            translateX = 280; // Right wing positioning offset
            rotateYAngle = -20; // Soft vintage outward angle
          }

          // Complete high-speed spring model
          const transitionConfig = {
            type: 'spring',
            stiffness: 900,
            damping: 50,
            mass: 0.3
          };

          return (
            <motion.div
              key={item.year}
              ref={isCenter ? activeCardRef : null}
              onMouseMove={isCenter ? handleMouseMove : undefined}
              onMouseLeave={isCenter ? handleMouseLeave : undefined}
              onClick={() => handleCardClick(idx, diff)}
              initial={false}
              animate={{
                x: translateX,
                scale: scale,
                opacity: opacity,
                z: translateZ,
                rotateY: isCenter ? tilt.y : rotateYAngle,
                rotateX: isCenter ? tilt.x : 0,
                visibility: isTargetVisible ? 'visible' : 'hidden',
              }}
              transition={transitionConfig}
              style={{
                position: 'absolute',
                width: '380px',
                height: '520px',
                transformStyle: 'preserve-3d',
                cursor: isCenter ? 'default' : 'pointer',
                zIndex: isCenter ? 20 : 10,
              }}
              // CSS container shadow elements and border styling matching Häagen-Dazs standards
              className={`rounded-[2.2rem] bg-white border border-[#ffe9e3] p-8 flex flex-col justify-between shadow-2xl transition-shadow duration-300 relative overflow-hidden ${
                isCenter ? 'shadow-[#6c2f00]/10 hover:shadow-[#6c2f00]/20' : 'brightness-[0.9] hover:brightness-100'
              }`}
            >
              {/* Premium Card Background Image if configured */}
              {item.bgImage && (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-300 pointer-events-none" 
                    style={{ backgroundImage: `url(${item.bgImage})` }}
                  />
                  {/* High contrast glass glaze overlay so that texts are perfect to read */}
                  <div className="absolute inset-0 bg-[#fffdfb]/88 backdrop-blur-[2px] z-0 pointer-events-none" />
                </>
              )}

              {/* Card Gold Inner Filigree Border */}
              <div className="absolute inset-4 border border-[#ffdbd0]/30 rounded-[1.6rem] pointer-events-none z-5" />
              <div className="absolute inset-4.5 border border-dashed border-[#ffdbd0]/20 rounded-[1.5rem] pointer-events-none z-5" />
              
              {/* Premium Corner Ornament vector points */}
              <div className="absolute top-6 left-6 w-2 h-2 border-t border-l border-[#b97a20]/40 z-5" />
              <div className="absolute top-6 right-6 w-2 h-2 border-t border-r border-[#b97a20]/40 z-5" />
              <div className="absolute bottom-6 left-6 w-2 h-2 border-b border-l border-[#b97a20]/40 z-5" />
              <div className="absolute bottom-6 right-6 w-2 h-2 border-b border-r border-[#b97a20]/40 z-5" />

              {/* Top metadata tags */}
              <div className="flex justify-between items-center relative z-10 select-none">
                <span className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#b97a20] uppercase bg-[#fff1ed] border border-[#ffdbd0] px-3 py-1 rounded-full">
                  ✦ {item.tag}
                </span>
                <span className="font-serif text-[28px] font-bold text-[#6c2f00] leading-none">
                  {item.year}
                </span>
              </div>

              {/* Central main typography display block */}
              <div className="space-y-4 my-auto relative z-10 text-center px-2">
                <h3 className="font-display text-[22px] md:text-[24px] font-bold text-[#6c2f00] leading-tight">
                  {item.heading}
                </h3>
                <div className="h-[2px] w-12 bg-[#b97a20]/30 mx-auto" />
                <p className="font-sans text-[13px] text-[#54433a] leading-relaxed line-clamp-6 text-justify">
                  {item.text}
                </p>
              </div>

              {/* Hand-drawn simulated luxury quotes footer */}
              <div className="relative z-10 pt-4 border-t border-[#ffe9e3] flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5 text-[#b97a20]">
                  <Award className="w-4 h-4" />
                  <span className="font-sans text-[10px] tracking-widest uppercase font-bold">哈根达斯典藏</span>
                </div>
                <span className="font-serif text-[11px] font-bold text-[#6c2f00]/60 italic">
                  Pure Heritage
                </span>
              </div>

              {/* Premium Background watermarks */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(#6c2f00_1px,transparent_1px)] bg-[size:12px_12px] opacity-[0.03] pointer-events-none rounded-br-[2.2rem]" />
            </motion.div>
          );
        })}

      </div>

      {/* Retro Wood Lacquered Custom Controls Panel */}
      <div className="flex items-center gap-6 relative z-30 select-none">
        
        {/* Left direction button */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border border-[#ffe9e3] bg-white text-[#6c2f00] hover:bg-[#fff1ed] flex items-center justify-center cursor-pointer hover:shadow-md active:scale-95 transition-all outline-none"
          title="Précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dynamic Center Page/Step bubble Indicators */}
        <div className="flex gap-2.5">
          {HISTORIAL_YEARS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                playBubbleSound();
                setActiveIndex(i);
                setTilt({ x: 0, y: 0 });
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i 
                  ? 'w-7 bg-[#6c2f00]' 
                  : 'w-2.5 bg-[#ffe9e3] hover:bg-[#6c2f00]/40'
              }`}
              title={`Page ${i + 1}`}
            />
          ))}
        </div>

        {/* Right direction button */}
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full border border-[#ffe9e3] bg-white text-[#6c2f00] hover:bg-[#fff1ed] flex items-center justify-center cursor-pointer hover:shadow-md active:scale-95 transition-all outline-none"
          title="Suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
}
