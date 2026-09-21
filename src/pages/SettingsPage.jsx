import { useRef, useState } from 'react';
import { Bell, Palette, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import AccountSection from '../components/settings/AccountSection';
import AppearanceSection from '../components/settings/AppearanceSection';
import NotificationSection from '../components/settings/NotificationSection';
import PreferencesSection from '../components/settings/PreferencesSection';
import SecuritySection from '../components/settings/SecuritySection';
import { gsap, useGSAP } from '../motion/gsap';
import { EASE } from '../motion/tokens';
import { prefersReducedMotion } from '../motion/reducedMotion';

const SECTIONS = [
  { id: 'account', label: 'Account', icon: UserRound, Component: AccountSection },
  { id: 'security', label: 'Security', icon: ShieldCheck, Component: SecuritySection },
  { id: 'notifications', label: 'Notifications', icon: Bell, Component: NotificationSection },
  { id: 'appearance', label: 'Appearance', icon: Palette, Component: AppearanceSection },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal, Component: PreferencesSection },
];

export default function SettingsPage() {
  const [active, setActive] = useState('account');
  const panelRef = useRef(null);
  const current = SECTIONS.find((s) => s.id === active);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(panelRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: EASE.out, clearProps: 'opacity,transform' });
    },
    { dependencies: [active], scope: panelRef },
  );

  const move = (event, index) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = SECTIONS[(index + step + SECTIONS.length) % SECTIONS.length];
    setActive(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <div className="page-container">
      <PageHeader title="Settings" description="Manage your account, alerts, appearance and preferences." />
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <div role="tablist" aria-label="Settings sections" aria-orientation="vertical" className="scrollbar-thin -mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:sticky lg:top-24 lg:mx-0 lg:h-fit lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
          {SECTIONS.map(({ id, label, icon: Icon }, index) => (
            <button
              key={id}
              id={`tab-${id}`}
              type="button"
              role="tab"
              aria-selected={active === id}
              aria-controls="settings-panel"
              tabIndex={active === id ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={(e) => move(e, index)}
              className={`flex shrink-0 items-center gap-2.5 rounded-control px-3.5 py-2.5 text-small font-semibold transition-colors ${active === id ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-raised hover:text-ink'}`}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        <div ref={panelRef} id="settings-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="min-w-0">
          <current.Component />
        </div>
      </div>
    </div>
  );
}
