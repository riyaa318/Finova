import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

function pageWindow(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set([1, count, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['gap', p] : [p]));
}

export default function Pagination({ page, pageCount, total, start, end, onChange, noun = 'transactions' }) {
  if (total === 0) return null;
  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-small text-muted" aria-live="polite">
        Showing <span className="font-semibold text-ink tabular-nums">{start + 1}-{end}</span> of <span className="font-semibold text-ink tabular-nums">{total}</span> {total === 1 ? noun.replace(/s$/, '') : noun}
      </p>
      <div className="flex items-center gap-1.5">
        <Button variant="secondary" size="sm" icon={ChevronLeft} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </Button>
        <ul className="hidden items-center gap-1 sm:flex">
          {pageWindow(page, pageCount).map((p, i) =>
            p === 'gap' ? (
              <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-subtle">
                ...
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => onChange(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={`h-8 min-w-8 rounded-control px-2 text-caption font-semibold tabular-nums transition-colors ${p === page ? 'bg-accent text-accent-fg' : 'text-muted hover:bg-raised hover:text-ink'}`}
                >
                  {p}
                </button>
              </li>
            ),
          )}
        </ul>
        <span className="px-2 text-small tabular-nums text-muted sm:hidden">
          Page {page} of {pageCount}
        </span>
        <Button variant="secondary" size="sm" iconRight={ChevronRight} disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
          Next
        </Button>
      </div>
    </nav>
  );
}
