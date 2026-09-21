export const MS_PER_DAY = 86_400_000;

const pad = (n) => String(n).padStart(2, "0");

export const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};
export const startOfToday = () => startOfDay(new Date());

export const toISODate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISODate(new Date());

export const parseISODate = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};
export const shiftISO = (iso, n) => toISODate(addDays(parseISODate(iso), n));
export const diffInDays = (from, to) =>
  Math.round((startOfDay(to) - startOfDay(from)) / MS_PER_DAY);
export const daysInMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
export const monthKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
export const startOfMonth = (date, offset = 0) =>
  new Date(date.getFullYear(), date.getMonth() + offset, 1);

export const isValidISODate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  return toISODate(parseISODate(value)) === value;
};

export const nowLocalISO = (date = new Date()) =>
  `${toISODate(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
