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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Medium Blue - matches button color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        orange: {
          50: '#fff2e8',
          100: '#ffe0cc',
          200: '#ffcc99',
          300: '#ffb366',
          400: '#ff9933',
          500: '#ff8000',
          600: '#ffa600', // Web Orange
          700: '#cc8500',
          800: '#996400',
          900: '#664300',
        },
        red: {
          600: '#ff4d4d', // Sunset Orange
        },
        yellow: {
          400: '#ffd900', // School Bus Yellow
        },
        green: {
          500: '#4cae4f', // Fruit Salad Green
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'scroll-left': 'scrollLeft 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

