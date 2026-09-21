import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChartNoAxesCombined, PiggyBank, Target } from 'lucide-react';
import AnimatedNumber from '../../motion/AnimatedNumber';
import { gsap, useGSAP } from '../../motion/gsap';
import { EASE } from '../../motion/tokens';
import { prefersReducedMotion } from '../../motion/reducedMotion';
import { formatINR } from '../../utils/format';
import Logo from '../ui/Logo';

const POINTS = [
  { icon: PiggyBank, text: 'Budgets that warn you before you overspend' },
  { icon: Target, text: 'Goals with deadlines you can actually hit' },
  { icon: ChartNoAxesCombined, text: 'Charts that explain your month in seconds' },
];

const LINE = 'M0 150 C67 146 103 118 153 124 S250 96 303 84 S397 92 447 58 S550 26 600 12';

/** Split-screen shell for login and signup: brand story on the left (large screens), form on the right. */
export default function AuthLayout({ title, subtitle, children, footer }) {
  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const areaRef = useRef(null);
  const formRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(formRef.current, { opacity: 0, y: 18, duration: 0.6, ease: EASE.out, clearProps: 'opacity,transform' });
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });
      tl.from('[data-brand-line]', { opacity: 0, y: 22, duration: 0.7, stagger: 0.09 })
        .to(path, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.25)
        .from(areaRef.current, { opacity: 0, duration: 1 }, 1.0)
        .from('[data-brand-card]', { opacity: 0, y: 24, scale: 0.96, duration: 0.7, ease: EASE.pop }, 0.9);
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-accent text-accent-fg lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div data-brand-line className="flex items-center gap-3">
          <Logo size={36} className="[&>rect]:fill-[rgb(var(--accent-fg))] [&>path]:stroke-[rgb(var(--accent))]" />
          <span className="text-h2 tracking-tight">FINOVA</span>
        </div>

        <div className="relative">
          <h2 data-brand-line className="max-w-md text-[2.75rem] font-extrabold leading-[1.05] tracking-tight">
            Know where every rupee goes.
          </h2>
          <p data-brand-line className="mt-4 max-w-md text-body opacity-85">
            Track spending, hold budgets and reach savings goals from one calm dashboard.
          </p>
          <ul className="mt-8 space-y-3.5">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} data-brand-line className="flex items-center gap-3 text-small font-medium">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-fg/15">
                  <Icon size={16} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-56" aria-hidden="true">
          <svg viewBox="0 0 600 170" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-40 w-full">
            <defs>
              <linearGradient id="auth-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path ref={areaRef} d={`${LINE} L600 170 L0 170 Z`} fill="url(#auth-area)" />
            <path ref={pathRef} d={LINE} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div data-brand-card className="absolute right-0 top-0 rounded-card bg-surface px-5 py-4 text-ink shadow-pop">
            <p className="text-caption font-semibold text-muted">Demo account balance</p>
            <p className="mt-0.5 text-h1 tabular-nums">
              <AnimatedNumber value={248650} format={formatINR} duration={1.8} />
            </p>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div ref={formRef} className="w-full max-w-md">
          <Link to="/login" aria-label="FINOVA" className="mb-8 inline-flex items-center gap-2.5 lg:hidden">
            <Logo size={32} />
            <span className="text-h2 tracking-tight text-ink">FINOVA</span>
          </Link>
          <h1 className="text-h1 text-ink sm:text-[2rem] sm:leading-tight">{title}</h1>
          <p className="mt-1.5 text-body text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-small text-muted">{footer}</p>
        </div>
      </main>
    </div>
  );
}
