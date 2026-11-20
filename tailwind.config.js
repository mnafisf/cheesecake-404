/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#7A0B1E',
          dark: '#590715',
          light: '#9E1B32',
        },
        cream: {
          DEFAULT: '#FFFBF5',
          soft: '#F7EDE2',
          border: '#EADBC8',
        },
        crust: '#C8925A',
        strawberry: '#D92B4B',
        ink: '#2B1416',
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 35px -10px rgba(122, 11, 30, 0.14)',
        card: '0 16px 40px -12px rgba(43, 20, 22, 0.10)',
        maroon: '0 10px 25px -5px rgba(122, 11, 30, 0.35)',
      },
    },
  },
  plugins: [],
}
