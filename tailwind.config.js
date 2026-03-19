/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf7',
          100: '#d7f8eb',
          200: '#b2efd8',
          300: '#7fe2bf',
          400: '#43cd9f',
          500: '#1eb487',
          600: '#12906e',
          700: '#12735a',
          800: '#145c49',
          900: '#134b3d',
        },
      },
      boxShadow: {
        soft: '0 20px 80px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
