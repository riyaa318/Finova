export const Skeleton = ({ className = "", style }) => (
  <div aria-hidden="true" style={style} className={`skeleton ${className}`} />
);

const Busy = ({ label, children, className = "" }) => (
  <div role="status" aria-busy="true" aria-label={label} className={className}>
    {children}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="card p-5">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="mt-4 h-8 w-36" />
    <Skeleton className="mt-4 h-4 w-28" />
    <Skeleton className="mt-4 h-9 w-full" />
  </div>
);

export const StatGridSkeleton = () => (
  <Busy
    label="Loading balances"
    className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4"
  >
    {Array.from({ length: 4 }, (_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </Busy>
);

export const ChartSkeleton = ({ height = 260, className = "" }) => (
  <Busy label="Loading chart" className={`card p-5 ${className}`}>
    <Skeleton className="h-5 w-40" />
    <Skeleton className="mt-2 h-4 w-56" />
    <Skeleton className="mt-6 w-full" style={{ height }} />
  </Busy>
);

export const ListSkeleton = ({ rows = 5, className = "" }) => (
  <Busy
    label="Loading list"
    className={`card divide-y divide-line ${className}`}
  >
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex items-center gap-3 p-4">
        <Skeleton className="h-9 w-9 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </Busy>
);

export const CardGridSkeleton = ({ count = 3 }) => (
  <Busy
    label="Loading"
    className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
  >
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="card p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="mt-6 h-6 w-40" />
        <Skeleton className="mt-4 h-2 w-full" />
        <Skeleton className="mt-4 h-4 w-3/4" />
      </div>
    ))}
  </Busy>
);

export const TableSkeleton = ({ rows = 8 }) => <ListSkeleton rows={rows} />;

export const PageLoading = () => (
  <div className="page-container">
    <Busy label="Loading page">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <div className="mt-8">
        <StatGridSkeleton />
      </div>
    </Busy>
  </div>
);

export const FullPageLoader = () => (
  <div className="flex min-h-dvh items-center justify-center bg-canvas">
    <Busy label="Loading FINOVA">
      <Skeleton className="h-10 w-10" />
    </Busy>
  </div>
);
