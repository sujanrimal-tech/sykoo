/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./about/*.html",
    "./blog/*.html",
    "./contact/*.html",
    "./project/*.html",
    "./skill/*.html",
    "./survey/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['"Outfit"', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}