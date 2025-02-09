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
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#4CAF50',
          600: '#45a049',
        }
      },
      keyframes: {
        'shooting-star': {
          '0%': { transform: 'translateX(0) translateY(50vh)', opacity: 0 },
          '5%': { opacity: 1 },
          '70%': { opacity: 1 },
          '100%': { transform: 'translateX(-100vw) translateY(75vh)', opacity: 0 },
        },
      },
      animation: {
        'shooting-star': 'shooting-star 4s linear infinite',
      },
      transitionDelay: {
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
      },
      fontFamily: {
        arabic: ['Scheherazade New', 'serif'],
      },
    },
  },
  plugins: [],
} 