import { initialsOf } from "../../utils/format";

export default function Avatar({ name, src, size = 36, className = "" }) {
  const style = {
    width: size,
    height: size,
    fontSize: Math.max(11, size * 0.38),
  };
  if (src)
    return (
      <img
        src={src}
        alt=""
        style={style}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  return (
    <span
      aria-hidden="true"
      style={style}
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-accent/15 font-bold text-accent ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}
