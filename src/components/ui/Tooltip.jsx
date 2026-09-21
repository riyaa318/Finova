export default function Tooltip({ label, children, side = 'top' }) {
  const position = side === 'top' ? 'bottom-full mb-1.5 left-1/2 -translate-x-1/2' : 'top-full mt-1.5 left-1/2 -translate-x-1/2';
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-40 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-caption font-medium text-canvas opacity-0 shadow-pop transition-opacity duration-150 group-focus-within/tt:opacity-100 group-hover/tt:opacity-100 ${position}`}
      >
        {label}
      </span>
    </span>
  );
}
