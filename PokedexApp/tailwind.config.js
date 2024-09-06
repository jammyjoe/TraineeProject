/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      flex: {'3-1-0': '3 1 0%',},
      fontFamilt: {
        sans: ['Flexo-Demi', 'sans-serif']
      }
  },
    plugins: [],
  }
}
