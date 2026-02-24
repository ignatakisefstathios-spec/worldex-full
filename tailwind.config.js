/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f0',
          100: '#fbe8e0',
          200: '#f6d0c1',
          300: '#efb096',
          400: '#e58865',
          500: '#dc6b42',
          600: '#cd5232',
          700: '#ab4029',
          800: '#8a3726',
          900: '#703124',
        },
        dark: {
          900: '#0a0a0a',
          800: '#141414',
          700: '#1a1a1a',
          600: '#262626',
          500: '#333333',
        },
        worldcoin: {
          blue: '#0052FF',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
