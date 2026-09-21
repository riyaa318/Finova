import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Button from "../components/ui/Button";
import { useEntrance } from "../motion/hooks";

export default function NotFoundPage() {
  const ref = useRef(null);
  const { pathname } = useLocation();
  useEntrance(ref, { y: 14 });
  return (
    <div className="page-container">
      <div
        ref={ref}
        className="card mx-auto mt-6 flex max-w-xl flex-col items-center px-6 py-16 text-center"
      >
        <p className="text-display tabular-nums text-accent">404</p>
        <h1 className="mt-2 text-h1 text-ink">This page does not exist</h1>
        <p className="mt-2 max-w-sm break-all text-body text-muted">
          <span className="font-semibold text-ink">{pathname}</span> is not part
          of FINOVA. It may have moved, or the link is mistyped.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Button as={Link} to="/dashboard" icon={LayoutDashboard}>
            Go to dashboard
          </Button>
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
