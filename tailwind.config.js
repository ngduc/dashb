module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [require('nightwind'), require('tailwindcss'), require('autoprefixer')]
};
