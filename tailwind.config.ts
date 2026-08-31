import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        clay: 'var(--clay)',
        'clay-dim': 'var(--clay-dim)',
        moss: 'var(--moss)',
        rust: 'var(--rust)',
        amber: 'var(--amber)',
        sand: 'var(--sand)',
        cream: 'var(--cream)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        'border-2': 'var(--border-2)',
        'border-3': 'var(--border-3)',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        '2xl': 'var(--r-2xl)',
      },
      zIndex: {
        content: 'var(--z-content)',
        tabbar: 'var(--z-tabbar)',
        nav: 'var(--z-nav)',
        fab: 'var(--z-fab)',
        topbar: 'var(--z-topbar)',
        scan: 'var(--z-scan)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        spring: 'var(--ease-spring)',
      },
      keyframes: {
        grainShift: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-1%,-2%)' },
          '30%': { transform: 'translate(2%,1%)' },
          '50%': { transform: 'translate(-2%,2%)' },
          '70%': { transform: 'translate(1%,-1%)' },
          '90%': { transform: 'translate(-1%,1%)' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.94)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        grain: 'grainShift 8s steps(10) infinite',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}
export default config
