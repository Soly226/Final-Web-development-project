export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#5048e5",
        "background-light": "#f6f6f8",
        "background-dark": "#121121",
        // Custom slate shades
        "slate-150": "#edf0f5",
        "slate-250": "#dde3ec",
        "slate-450": "#94a3b8",
        "slate-550": "#64748b",
        "slate-650": "#475569",
        "slate-850": "#1e2a3d",
        "slate-950": "#0b1120",
        // Custom indigo shades
        "indigo-550": "#5b5bff",
        "indigo-650": "#4f46e5",
        "indigo-750": "#4338ca",
        "indigo-755": "#3d33c0",
        "indigo-850": "#312e81",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
}
