const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.js", "./components/**/*.js", "./lib/**/*.js"],
  theme: {
    colors: {
      primary: "#0e213c",
      secondary: "#4b92ac",
      white: "#ffffff",
      gray: {
        200: "#e5e7eb",
        300: "#d1d5db",
        500: "#6b7280",
        800: "#1f2937",
      },
      green: {
        760: "#1ED760",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Nunito", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
