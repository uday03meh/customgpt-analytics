/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oai-bg': '#0d0d0d',
        'oai-surface': '#171717',
        'oai-surface2': '#1e1e1e',
        'oai-border': '#2a2a2a',
        'oai-text': '#ececec',
        'oai-muted': '#8e8ea0',
        'oai-accent': '#19c37d',
        'oai-hover': '#2a2a2a',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', '-apple-system', 'system-ui', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
