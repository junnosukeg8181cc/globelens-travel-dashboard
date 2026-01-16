/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0052CC",
        "primary-dark": "#0042a3",
        "background-light": "#F3F4F6",
        "background-dark": "#0f172a",
        surface: "#FFFFFF",
        "surface-dark": "#1e293b",
        gold: "#D9A54C",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        serif: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
}