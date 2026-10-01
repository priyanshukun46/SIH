/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#048ABF',
        mustard: '#F2CC0C',
        oatmilk: '#F2E3D5',
        olive: '#8C8851',
      },
      fontFamily: {
        mono: ['Montserrat', 'sans-serif'],
        sans: ['Montserrat', 'sans-serif']
      }
    },
  },
  plugins: [],
}
