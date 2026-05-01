import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for magnetic button effect — button content follows cursor
 */
export function useMagneticEffect(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleLeave = () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    };

    const handleEnter = () => {
      el.style.transition = 'transform 0.1s ease-out';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('mouseenter', handleEnter);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('mouseenter', handleEnter);
    };
  }, [strength]);

  return ref;
}

/**
 * Custom hook for ripple click effect on elements
 */
export function useRippleEffect() {
  const handleRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    el.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }, []);

  return handleRipple;
}

/**
 * Hook for smooth scroll spy — tracks which section is in view
 */
export function useScrollSpy(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id, index) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(index);
          }
        },
        { threshold: 0.4, rootMargin: '-10% 0px -10% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [sectionIds]);

  return activeSection;
}

/**
 * Hook for mouse trail particles
 */
export function useMouseTrail(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let lastTime = 0;
    const particles: HTMLDivElement[] = [];
    const MAX_PARTICLES = 12;

    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 50) return; // Throttle
      lastTime = now;

      const particle = document.createElement('div');
      particle.className = 'mouse-trail-particle';
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      document.body.appendChild(particle);
      particles.push(particle);

      if (particles.length > MAX_PARTICLES) {
        const old = particles.shift();
        old?.remove();
      }

      setTimeout(() => {
        particle.remove();
        const idx = particles.indexOf(particle);
        if (idx > -1) particles.splice(idx, 1);
      }, 800);
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      particles.forEach(p => p.remove());
    };
  }, [enabled]);
}

/**
 * Hook for counting up numbers with easing
 */
export function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    let animFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // quartic ease-out
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [target, duration, start]);

  return count;
}

/**
 * Hook for detecting element visibility (intersection observer)
 */
export function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // only trigger once
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/**
 * Hook for smooth 3D tilt effect on cards
 */
export function useTilt3D(maxTilt = 12) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * maxTilt;
    const tiltY = (0.5 - x) * maxTilt;
    ref.current.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
  }, [maxTilt]);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return { ref, handleMove, handleLeave };
}
