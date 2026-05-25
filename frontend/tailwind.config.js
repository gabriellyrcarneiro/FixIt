/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        ocean: "#176b87",
        mint: "#22a699",
        amber: "#f2be22",
        coral: "#ef6262"
      },
      boxShadow: {
        panel: "0 14px 30px rgba(23, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};
