import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text = '',
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts && document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const el = ref.current;
      const targets = el.querySelectorAll('.split-item');
      if (targets.length === 0) return;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: ref
    }
  );

  const style: React.CSSProperties = {
    textAlign: textAlign as any,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity'
  };

  const Tag = tag || 'p';

  const renderContent = () => {
    if (splitType === 'lines') {
      return text.split('\n').map((line, lIdx) => (
        <span
          key={lIdx}
          className="split-item split-line block"
          style={{ display: 'block', willChange: 'transform, opacity' }}
        >
          {line}
        </span>
      ));
    }

    if (splitType === 'words') {
      return text.split(' ').map((word, wIdx) => (
        <span
          key={wIdx}
          className="split-item split-word inline-block mr-[0.25em]"
          style={{ display: 'inline-block', RichieChange: 'transform, opacity' } as any}
        >
          {word}
        </span>
      ));
    }

    // Default: 'chars' support English and Chinese characters cleanly.
    // For Chinese/English mix, splitting on characters:
    // Let's split using character-by-character while grouping words if possible, or simple split of every character.
    // Let's do simple character splitting but keep space representation.
    const chars = Array.from(text);
    return chars.map((char, cIdx) => {
      if (char === ' ') {
        return (
          <span key={cIdx} className="inline-block w-[0.25em]">
            &nbsp;
          </span>
        );
      }
      return (
        <span
          key={cIdx}
          className="split-item split-char inline-block"
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <Tag ref={ref as any} style={style} className={`split-parent ${className}`}>
      {renderContent()}
    </Tag>
  );
}
