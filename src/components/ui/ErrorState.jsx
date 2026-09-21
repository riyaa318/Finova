import { RefreshCw, TriangleAlert } from 'lucide-react';
import { useRef } from 'react';
import { useEntrance } from '../../motion/hooks';
import Button from './Button';

export default function ErrorState({ title = 'Something went wrong', message = 'We could not load this section. Check your connection and try again.', onRetry, className = '' }) {
  const ref = useRef(null);
  useEntrance(ref, { y: 10, duration: 0.45 });
  return (
    <div ref={ref} role="alert" className={`card flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}>
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <TriangleAlert size={22} aria-hidden="true" />
      </span>
      <h3 className="text-h3 text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-small text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" icon={RefreshCw} onClick={onRetry} className="mt-5">
          Try again
        </Button>
      )}
    </div>
  );
}
