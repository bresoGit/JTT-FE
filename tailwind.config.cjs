/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        jack: {
          bg: "#050608",
          card: "#0b0d10",
          border: "#1f2025",
          red: "#b91c1c",
          redSoft: "#7f1d1d",
          redMuted: "#450a0a",
        },
      },
      boxShadow: {
        "jack-soft": "0 18px 45px rgba(0,0,0,0.65)",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
