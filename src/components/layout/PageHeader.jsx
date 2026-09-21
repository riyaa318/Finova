import { useRef } from 'react';
import { gsap, useGSAP } from '../../motion/gsap';
import { EASE } from '../../motion/tokens';
import { prefersReducedMotion } from '../../motion/reducedMotion';

/** Page title block. Title -> description -> meta -> actions enter as one GSAP timeline. */
export default function PageHeader({ title, description, meta, actions, backLink }) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const metaRef = useRef(null);
  const actionsRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: EASE.out, duration: 0.55 } });
      tl.from(titleRef.current, { opacity: 0, y: 16, clearProps: 'opacity,transform' });
      if (descRef.current) tl.from(descRef.current, { opacity: 0, y: 12, clearProps: 'opacity,transform' }, '-=0.38');
      if (metaRef.current) tl.from(metaRef.current, { opacity: 0, y: 10, clearProps: 'opacity,transform' }, '-=0.4');
      if (actionsRef.current) tl.from(actionsRef.current, { opacity: 0, y: 10, clearProps: 'opacity,transform' }, '-=0.45');
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
      <div className="min-w-0">
        {backLink}
        <h1 ref={titleRef} className="text-h1 text-ink sm:text-[2rem] sm:leading-tight">
          {title}
        </h1>
        {description && (
          <p ref={descRef} className="mt-1.5 text-body text-muted">
            {description}
          </p>
        )}
        {meta && (
          <p ref={metaRef} className="mt-1 text-small text-subtle">
            {meta}
          </p>
        )}
      </div>
      {actions && (
        <div ref={actionsRef} className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
