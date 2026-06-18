import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: { DEFAULT: '#F2EDE4', dark: '#E8E0D3' },
        bark: { DEFAULT: '#2C1F0F', mid: '#4A3520' },
        ink: '#1A1208',
        cream: '#FAF7F2',
        moss: { DEFAULT: '#3D5C2E', light: '#6B8F52' },
        clay: { DEFAULT: '#C4714A', light: '#E8956E' },
        risk: '#B43C28',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        pill: '999px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(44,31,15,0.08), 0 0 0 1px rgba(196,113,74,0.06)',
        md: '0 4px 20px rgba(44,31,15,0.12), 0 1px 4px rgba(44,31,15,0.06)',
        lg: '0 12px 40px rgba(44,31,15,0.16), 0 4px 12px rgba(44,31,15,0.08)',
        bark: '0 8px 32px rgba(196,113,74,0.25), 0 2px 8px rgba(196,113,74,0.12)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(.16,1,.3,1) both',
        'breathe': 'breathe 6s ease-in-out infinite',
        'grain': 'grainShift 0.5s steps(1) infinite',
        'scan-line': 'scanAnim 2.5s ease-in-out infinite',
        'logo-pulse': 'logoPulse 3s ease-in-out infinite',
        'phone-float': 'phoneFloat 6s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'scale-in': 'scaleIn 0.3s ease-out both',
        'fade-in-up': 'fadeInUp 0.4s ease-out both',
        'float': 'float 6s cubic-bezier(0.65,0,0.35,1) infinite',
        'float-slow': 'float 9s cubic-bezier(0.65,0,0.35,1) infinite',
        'page-enter': 'page-enter 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'toast-in': 'toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'score-fill': 'score-fill 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        grainShift: {
          '0%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-5%,-5%)' },
          '40%': { transform: 'translate(3%,7%)' },
          '60%': { transform: 'translate(-8%,2%)' },
          '80%': { transform: 'translate(6%,-4%)' },
          '100%': { transform: 'translate(0,0)' },
        },
        scanAnim: {
          '0%': { top: '10%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '90%', opacity: '0' },
        },
        logoPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.6)', opacity: '0.6' },
        },
        phoneFloat: {
          '0%, 100%': { transform: 'translateY(0) rotateY(-12deg) rotateX(5deg)' },
          '50%': { transform: 'translateY(-16px) rotateY(-12deg) rotateX(5deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(196,113,74,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(196,113,74,0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(-1.5deg)' },
          '66%': { transform: 'translateY(-5px) rotate(1deg)' },
        },
        'page-enter': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'score-fill': {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
