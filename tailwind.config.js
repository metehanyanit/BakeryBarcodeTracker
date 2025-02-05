/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F4E4BC',
          dark: '#E6D5BC',
        }
      },
      fontFamily: {
        medieval: ['MedievalSharp', 'serif'],
        manuscript: ['Alegreya', 'serif'],
      },
    },
  },
  plugins: [],
};
