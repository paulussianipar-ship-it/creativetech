/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border-color)",
        input: "var(--border-color)",
        ring: "var(--primary)",
        background: "var(--bg-color)",
        foreground: "var(--text-color)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "rgba(255,255,255,0.05)",
          foreground: "var(--text-muted)",
        },
        card: {
          DEFAULT: "var(--surface-color)",
          foreground: "var(--text-color)",
        },
      }
    },
  },
  plugins: [],
}
