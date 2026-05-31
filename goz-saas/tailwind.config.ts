import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0a0a0a',
          800: '#111111',
          700: '#161616',
          600: '#1d1d1d',
          500: '#262626',
        },
        bone: {
          DEFAULT: '#f4ede4',
          dim: '#cfc8bf',
          mute: '#8a847c',
        },
        ember: {
          DEFAULT: '#ff3d2e',
          deep: '#cc2a1d',
          glow: '#ffb2a8',
        },
        brand: { DEFAULT: '#ff3d2e', dark: '#cc2a1d' },
        lime: {
          DEFAULT: '#D4FF00',
          dim: '#a8cc00',
          glow: '#e6ff66',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        editorial: '-0.06em',
      },
      animation: {
        'rise': 'rise 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade': 'fade 500ms ease-out both',
        'shimmer': 'shimmer 2.4s linear infinite',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
        'grain': 'grain 8s steps(8) infinite',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-5%,-10%)' },
          '20%': { transform: 'translate(-15%,5%)' },
          '30%': { transform: 'translate(7%,-25%)' },
          '40%': { transform: 'translate(-5%,25%)' },
          '50%': { transform: 'translate(-15%,10%)' },
          '60%': { transform: 'translate(15%,0%)' },
          '70%': { transform: 'translate(0%,15%)' },
          '80%': { transform: 'translate(3%,35%)' },
          '90%': { transform: 'translate(-10%,10%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
