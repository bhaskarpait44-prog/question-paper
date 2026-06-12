/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['"Playfair Display"', 'Georgia', 'serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'sans': ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f8f7f4',
          100: '#eeebe4',
          200: '#d9d3c7',
          300: '#bfb5a4',
          400: '#a39282',
          500: '#8c7a6a',
          600: '#7a6659',
          700: '#65544a',
          800: '#534540',
          900: '#463b38',
          950: '#261f1e',
        },
        crimson: {
          500: '#c0392b',
          600: '#a93226',
        },
        gold: {
          400: '#f0c040',
          500: '#d4a520',
        }
      }
    },
  },
  plugins: [],
}
