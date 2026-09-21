import { useRef } from 'react';
import { useButtonMotion } from '../../motion/hooks';

const TONES = {
  neutral: 'text-muted hover:bg-raised hover:text-ink',
  danger: 'text-muted hover:bg-danger/10 hover:text-danger',
  accent: 'text-accent hover:bg-accent/10',
};
const SIZES = { sm: 'h-8 w-8', md: 'h-10 w-10' };

/** Icon-only button. `label` is required so every control has an accessible name. */
export default function IconButton({ label, icon: Icon, tone = 'neutral', size = 'md', as: Component = 'button', className = '', badge = false, ...rest }) {
  const ref = useRef(null);
  useButtonMotion(ref);
  return (
    <Component
      ref={ref}
      {...(Component === 'button' ? { type: rest.type ?? 'button' } : {})}
      aria-label={label}
      title={label}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-control transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${TONES[tone]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      <Icon size={18} strokeWidth={2} aria-hidden="true" />
      {badge && <span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-canvas" />}
    </Component>
  );
}
