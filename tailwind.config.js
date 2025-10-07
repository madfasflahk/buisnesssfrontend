/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'app-primary': {
          100: 'var(--color-app-primary-100)',
          200: 'var(--color-app-primary-200)',
          300: 'var(--color-app-primary-300)',
          400: 'var(--color-app-primary-400)',
          500: 'var(--color-app-primary-500)',
          600: 'var(--color-app-primary-600)',
          700: 'var(--color-app-primary-700)',
          800: 'var(--color-app-primary-800)',
          900: 'var(--color-app-primary-900)',
        },
      },
    },
  },
  plugins: [],
};
