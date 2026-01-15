/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fifa-dark': '#1a1a1a',
        'fifa-darker': '#141414',
        'fifa-gray': '#2a2a2a',
        'fifa-light-gray': '#3a3a3a',
        'fifa-group': '#4a7c59',
        'fifa-r32': '#2d8a8a',
        'fifa-r16': '#e07a3d',
        'fifa-qf': '#f5f5f5',
        'fifa-sf': '#f5f5f5',
        'fifa-final': '#ffd700',
        'fifa-gold': '#c9a227',
        'fifa-text': '#ffffff',
        'fifa-text-muted': '#888888',
      },
      fontFamily: {
        'heading': ['Oswald', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

