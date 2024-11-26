/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        monaco: {
          dark: '#1e1e1e',
          light: '#ffffff'
        }
      }
    },
  },
  plugins: [],
};