'use client';

import React, { useEffect, useRef, useState, useId } from 'react';

/**
 * Hook to detect when an element enters the viewport via native IntersectionObserver.
 * Disconnects once visible for zero continuous CPU overhead.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options?.triggerOnce !== false) {
            observer.disconnect();
          }
        } else if (options?.triggerOnce === false) {
          setInView(false);
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? '0px 0px -50px 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.triggerOnce]);

  return { ref, inView };
}

/**
 * ScrollReveal: Hardware-accelerated entry animation on scroll.
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number; // px
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 28
}: ScrollRevealProps) {
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const getTransform = () => {
    if (inView) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={`will-change-[transform,opacity] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: getTransform(),
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

/**
 * StaggerGrid: Reveals direct children with cascading delays.
 */
export function StaggerGrid({
  children,
  className = '',
  baseDelay = 80
}: {
  children: React.ReactNode;
  className?: string;
  baseDelay?: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div
            className="will-change-[transform,opacity] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
              transitionDelay: `${idx * baseDelay}ms`
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

/**
 * CountUp: Smooth 60fps numerical ticker with cubic easing.
 * Triggered only once when element enters the viewport.
 */
interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number; // ms
  className?: string;
  separator?: boolean;
}

export function CountUp({
  end,
  prefix = '',
  suffix = '',
  duration = 1400,
  className = '',
  separator = true
}: CountUpProps) {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutCubic curve for realistic deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easedProgress * end);

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, end, duration]);

  const formatted = separator ? displayValue.toLocaleString('en-US') : displayValue.toString();

  return (
    <span ref={ref} className={className} dir="ltr">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/**
 * HeroAtmosphere: Pure CSS/SVG living luxury aurora background.
 * Zero external video, zero canvas, 100% lightweight and GPU-accelerated.
 */
export function HeroAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      {/* 1. Breathing Golden Aurora Lights */}
      <div className="absolute -top-32 start-1/2 -translate-x-1/2 h-[600px] w-[950px] rounded-full bg-gradient-to-b from-gold/20 via-amber-500/10 to-transparent blur-[140px] animate-aurora-glow will-change-transform" />

      {/* 2. Deep Royal Blue Ambient Fill */}
      <div className="absolute top-1/4 -start-48 h-[550px] w-[650px] rounded-full bg-gradient-to-tr from-blue-700/25 via-navy-light/20 to-transparent blur-[130px] animate-aurora-secondary will-change-transform" />

      {/* 3. Warm Amber Side Flare */}
      <div className="absolute -bottom-20 -end-32 h-[500px] w-[600px] rounded-full bg-gradient-to-bl from-gold/15 via-gold-dark/10 to-transparent blur-[120px] will-change-transform" />

      {/* 4. Fine Aerospace Coordinate Grid with Ambient Opacity */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#d9b87f_1px,transparent_1px)] [background-size:36px_36px]" />

      {/* 5. Smooth Horizon Light Beam */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent animate-beam-horizon" />
    </div>
  );
}
