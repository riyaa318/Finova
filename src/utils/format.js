import { CURRENCIES, DEFAULT_CURRENCY, DEFAULT_LANGUAGE } from './constants';
import { parseISODate } from './dates';

const MINUS = '\u2212';
const trimZero = (n) => n.toFixed(1).replace(/\.0$/, '');

/** Builds currency helpers for one currency. Inputs are always INR amounts. */
export function makeMoneyFormatter(code = DEFAULT_CURRENCY) {
  const cfg = CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY];
  const build = (digits) =>
    new Intl.NumberFormat(cfg.locale, {
      style: 'currency',
      currency: cfg.code,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  const whole = build(0);
  const precise = build(2);
  const compactFmt = new Intl.NumberFormat(cfg.locale, {
    style: 'currency',
    currency: cfg.code,
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  const money = (amount = 0) => {
    const value = amount * cfg.rate;
    const isWhole = cfg.code === 'INR' ? Math.abs(amount - Math.round(amount)) < 0.005 : Math.abs(value) >= 100;
    return (isWhole ? whole : precise).format(cfg.code === 'INR' && isWhole ? Math.round(value) : value);
  };

  const signed = (amount = 0) => `${amount < 0 ? MINUS : '+'}${money(Math.abs(amount))}`;

  const compact = (amount = 0) => {
    const value = amount * cfg.rate;
    if (cfg.code !== 'INR') return compactFmt.format(value).replace('-', MINUS);
    const abs = Math.abs(value);
    const sign = value < 0 ? MINUS : '';
    if (abs >= 1e7) return `${sign}${cfg.symbol}${trimZero(abs / 1e7)}Cr`;
    if (abs >= 1e5) return `${sign}${cfg.symbol}${trimZero(abs / 1e5)}L`;
    if (abs >= 1e3) return `${sign}${cfg.symbol}${trimZero(abs / 1e3)}K`;
    return `${sign}${cfg.symbol}${Math.round(abs)}`;
  };

  return {
    code: cfg.code,
    symbol: cfg.symbol,
    money,
    signed,
    compact,
    toDisplay: (base) => Math.round(base * cfg.rate * 100) / 100,
    toBase: (shown) => Math.round((shown / cfg.rate) * 100) / 100,
  };
}

export function makeDateFormatter(locale = DEFAULT_LANGUAGE) {
  const make = (opts) => new Intl.DateTimeFormat(locale, opts);
  const short = make({ day: 'numeric', month: 'short' });
  const medium = make({ day: 'numeric', month: 'short', year: 'numeric' });
  const long = make({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const weekdayDay = make({ weekday: 'long', day: 'numeric', month: 'long' });
  const monthShort = make({ month: 'short' });
  const monthYear = make({ month: 'short', year: '2-digit' });
  const asDate = (v) => (v instanceof Date ? v : parseISODate(v));
  return {
    short: (v) => short.format(asDate(v)),
    medium: (v) => medium.format(asDate(v)),
    long: (v) => long.format(asDate(v)),
    weekdayDay: (v) => weekdayDay.format(asDate(v)),
    month: (v) => monthShort.format(asDate(v)),
    monthYear: (v) => monthYear.format(asDate(v)),
  };
}

export function formatPercent(value, { sign = false, digits = 1 } = {}) {
  if (value == null || Number.isNaN(value)) return '\u2014';
  const abs = Math.abs(value).toFixed(digits);
  if (!sign) return `${value < 0 ? MINUS : ''}${abs}%`;
  return `${value < 0 ? MINUS : '+'}${abs}%`;
}

export function timeAgo(iso, now = Date.now()) {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'short' });
  const steps = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return 'Just now';
}

export const initialsOf = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U';

export const greetingFor = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const chartColor = (index) => `rgb(var(--chart-${index}))`;
export const chartColorAlpha = (index, alpha) => `rgb(var(--chart-${index}) / ${alpha})`;

/** Plain INR string for text that gets stored (notifications, CSV) rather than displayed live. */
export const formatINR = (amount) => `\u20B9${Number(amount).toLocaleString('en-IN')}`;
