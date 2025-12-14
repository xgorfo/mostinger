/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f3',
          100: '#f7e8d8',
          200: '#efd0b1',
          300: '#e4b184',
          400: '#d99056',
          500: '#c97539',
          600: '#b35d2e',
          700: '#954829',
          800: '#7a3c27',
          900: '#653322',
        },
        western: {
          leather: '#8B4513',
          sand: '#D2B48C',
          dust: '#A0826D',
          gunmetal: '#2C3539',
          rope: '#DEB887',
          whiskey: '#D2691E',
        }
      },
      fontFamily: {
        western: ['"Courier New"', 'monospace'],
      }
    },
  },
  plugins: [],
}