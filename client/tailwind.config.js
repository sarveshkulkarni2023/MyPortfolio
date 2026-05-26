/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#030712', // gray-950
          darker: '#020617', // slate-950
          dark: '#0f172a', // slate-900
          mid: '#1e293b', // slate-800
          light: '#334155', // slate-700
        },
        neon: {
          blue: '#3b82f6', // blue-500
          cyan: '#0ea5e9', // sky-500
          purple: '#6366f1', // indigo-500
          pink: '#ec4899', // pink-500
          green: '#10b981', // emerald-500
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.02)',
          medium: 'rgba(255, 255, 255, 0.04)',
          heavy: 'rgba(255, 255, 255, 0.08)',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 4px 20px rgba(0, 0, 0, 0.5)',
        'neon-strong': '0 8px 30px rgba(0, 0, 0, 0.8)',
        'neon-purple': '0 4px 20px rgba(0, 0, 0, 0.5)',
        glass: '0 4px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
        'cyber-gradient': 'linear-gradient(135deg, #030712 0%, #0f172a 100%)',
        'neon-gradient': 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      animation: {
        'pulse-neon': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'none',
        'grid-move': 'none',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'none',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
