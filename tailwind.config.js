/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        principal: '#000000',
        secundario: '#FFFFFF',
        acento: '#B88E2F',
        'acento-secundario': '#F9D13E',
        'gris-oscuro': '#333333',
        'gris-medio': '#666666',
        'gris-claro': '#F0F2F5',
        'border-color': '#E5E5E5',
      },
      fontFamily: {
        sans: ['Satoshi', 'Sora', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
