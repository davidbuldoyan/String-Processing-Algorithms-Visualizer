/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'algo-match': '#16a34a',
        'algo-mismatch': '#dc2626',
        'algo-window': '#2563eb',
        'algo-hash': '#ca8a04',
        'algo-zbox': '#9333ea',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
