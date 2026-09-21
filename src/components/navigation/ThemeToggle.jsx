import { useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useContexts';
import { gsap, useGSAP } from '../../motion/gsap';
import { useButtonMotion } from '../../motion/hooks';
import { EASE } from '../../motion/tokens';
import { prefersReducedMotion } from '../../motion/reducedMotion';

/** Light/dark switch. The icon spins in when the theme changes. */
export default function ThemeToggle({ showLabel = false, className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef(null);
  const iconRef = useRef(null);
  const first = useRef(true);
  useButtonMotion(buttonRef);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (!prefersReducedMotion()) gsap.fromTo(iconRef.current, { rotate: -80, scale: 0.5, opacity: 0 }, { rotate: 0, scale: 1, opacity: 1, duration: 0.45, ease: EASE.pop });
    },
    { dependencies: [theme], scope: buttonRef },
  );

  const Icon = theme === 'dark' ? Sun : Moon;
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 items-center gap-2.5 rounded-control text-muted transition-colors hover:bg-raised hover:text-ink ${showLabel ? 'justify-start px-3' : 'w-10 justify-center'} ${className}`}
    >
      <span ref={iconRef} className="inline-flex" aria-hidden="true">
        <Icon size={18} />
      </span>
      {showLabel && <span className="text-small font-semibold">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
    </button>
  );
}
