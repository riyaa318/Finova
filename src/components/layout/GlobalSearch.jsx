import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useFinance } from "../../hooks/useContexts";
import { useDebounce } from "../../hooks/useDebounce";
import { useFormatters } from "../../hooks/useFormatters";
import { gsap, useGSAP } from "../../motion/gsap";
import { prefersReducedMotion } from "../../motion/reducedMotion";
import { matchesQuery, sortTransactions } from "../../utils/transactions";
import SearchInput from "../forms/SearchInput";
import CategoryIcon from "../ui/CategoryIcon";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 200);
  const { transactions } = useFinance();
  const { signed, date } = useFormatters();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const popoverRef = useRef(null);

  const trimmed = debounced.trim();
  const results = useMemo(
    () =>
      trimmed
        ? sortTransactions(
            transactions.filter((t) => matchesQuery(t, trimmed)),
          ).slice(0, 5)
        : [],
    [transactions, trimmed],
  );
  const showPopover = open && query.trim().length > 0;

  useGSAP(
    () => {
      if (showPopover && popoverRef.current && !prefersReducedMotion())
        gsap.from(popoverRef.current, { opacity: 0, y: -6, duration: 0.2 });
    },
    { dependencies: [showPopover], scope: rootRef },
  );

  const reset = () => {
    setQuery("");
    setOpen(false);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/transactions?q=${encodeURIComponent(query.trim())}`);
    reset();
  };

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={submit}
      onBlur={(e) =>
        !rootRef.current.contains(e.relatedTarget) && setOpen(false)
      }
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      className="relative min-w-0 flex-1 sm:max-w-md"
    >
      <SearchInput
        value={query}
        onChange={(v) => {
          setQuery(v);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search"
        label="Search transactions"
      />
      {showPopover && (
        <div
          ref={popoverRef}
          className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-card border border-line bg-surface shadow-pop"
        >
          {results.length ? (
            <ul>
              {results.map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/transactions/${t.id}`}
                    onClick={reset}
                    className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-raised"
                  >
                    <CategoryIcon category={t.category} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-small font-semibold text-ink">
                        {t.merchant}
                      </span>
                      <span className="block truncate text-caption text-muted">
                        {t.category}, {date.short(t.date)}
                      </span>
                    </span>
                    <span className="text-small font-semibold tabular-nums text-ink">
                      {signed(t.type === "income" ? t.amount : -t.amount)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-5 text-center text-small text-muted">
              {trimmed === query.trim()
                ? `No transactions match "${trimmed}".`
                : "Searching..."}
            </p>
          )}
          <button
            type="submit"
            className="flex w-full items-center justify-between border-t border-line bg-raised/60 px-4 py-2.5 text-small font-semibold text-accent transition-colors hover:bg-raised"
          >
            See all results
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      )}
    </form>
  );
}
