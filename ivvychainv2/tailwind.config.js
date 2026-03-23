/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-dark': '#2D2F30',
        'content-bg': '#E8EEF4',
        'venn-orange': '#FF8C42',
        'venn-blue': '#87CEEB',
        'venn-green': '#90EE90',
      },
    },
  },
  plugins: [],
}

