import { Suspense, useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { gsap, useGSAP } from './gsap';
import { EASE } from './tokens';
import { prefersReducedMotion, useReducedMotion } from './reducedMotion';
import { PageLoading } from '../components/ui/LoadingState';

/**
 * Renders the active child route with a short exit -> enter transition (~450ms total).
 * The previous route's element is kept mounted until the exit tween finishes.
 */
export default function PageTransition() {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const reduced = useReducedMotion();
  const containerRef = useRef(null);
  const latest = useRef({ key: pathname, outlet });
  const [shown, setShown] = useState({ key: pathname, outlet });

  useEffect(() => {
    latest.current = { key: pathname, outlet };
  });

  useEffect(() => {
    if (pathname === shown.key || reduced || !containerRef.current) return undefined;
    const tween = gsap.to(containerRef.current, {
      opacity: 0,
      y: -6,
      duration: 0.16,
      ease: EASE.in,
      onComplete: () => setShown(latest.current),
    });
    return () => tween.kill();
  }, [pathname, shown.key, reduced]);

  const settled = reduced || pathname === shown.key;
  const activeKey = reduced ? pathname : shown.key;

  useGSAP(
    () => {
      if (!containerRef.current || prefersReducedMotion()) return;
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.32, ease: EASE.out, clearProps: 'opacity,transform' },
      );
    },
    { dependencies: [activeKey], scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <Suspense fallback={<PageLoading />}>{settled ? outlet : shown.outlet}</Suspense>
    </div>
  );
}
