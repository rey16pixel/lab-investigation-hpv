/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          dark: '#1e293b',
          blue: '#3b82f6',
          light: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}