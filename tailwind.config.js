/** Every colour resolves to a CSS variable (see src/styles/index.css) so light/dark share one token set. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        raised: token('raised'),
        line: { DEFAULT: token('line'), strong: token('line-strong') },
        ink: token('ink'),
        muted: token('muted'),
        subtle: token('subtle'),
        accent: { DEFAULT: token('accent'), strong: token('accent-strong'), fg: token('accent-fg') },
        danger: token('danger'),
        warning: token('warning'),
        success: token('success'),
        info: token('info'),
        scrim: token('scrim'),
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        display: ['2.75rem', { lineHeight: '1.04', letterSpacing: '-0.04em', fontWeight: '700' }],
        figure: ['1.875rem', { lineHeight: '1.1', letterSpacing: '-0.035em', fontWeight: '700' }],
        h1: ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '700' }],
        h2: ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
        h3: ['1rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '650' }],
        body: ['0.9375rem', { lineHeight: '1.6' }],
        small: ['0.8125rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.005em' }],
      },
      borderRadius: { card: '14px', control: '10px' },
      boxShadow: { card: 'var(--shadow-card)', pop: 'var(--shadow-pop)' },
      screens: { xs: '420px' },
    },
  },
  plugins: [],
};
