/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        // "ink" = deep forest green, used for sidebar/hero/nav backgrounds
        ink: {
          950: '#0B1F14',
          900: '#12331F',
          800: '#1A4A2E',
        },
        // "brand" = primary action green (buttons, links, active states)
        brand: {
          50: '#EAF7EE',
          500: '#1B7A3D',
          600: '#166534',
          700: '#0F5027',
        },
        amber: {
          400: '#F5A623',
          500: '#F59E0B',
        },
        cream: {
          50: '#F7F5F0',
        },
      },
    },
  },
  plugins: [],
};
