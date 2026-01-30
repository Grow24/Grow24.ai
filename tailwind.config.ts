import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
          950: '#052e16',
        },
        // BCG-style light green for CTA buttons
        'cta-green': {
          50: '#f0fdf9',
          100: '#ccfef0',
          200: '#99fde1',
          300: '#66fcd2',
          400: '#33fbc3',
          500: '#00D084', // Main BCG-style light green
          600: '#00b870',
          700: '#008f58',
          800: '#006640',
          900: '#003d28',
        },
        // Gold theme for call-to-information buttons
        'info-gold': {
          50: '#fffbf0',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#D4AF37', // Main gold color
          600: '#b8941f',
          700: '#9a7a1a',
          800: '#7c6015',
          900: '#5e4610',
        },
      },
      backdropBlur: {
        glass: '10px',
        'glass-md': '20px',
        'glass-lg': '30px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
