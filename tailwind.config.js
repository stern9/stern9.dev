module.exports = {
  darkMode: "class",
  purge: ["./pages/**/*.js", "./components/**/*.js", "./lib/**/*.js"],
  theme: {
    colors: {
      primary: "#0e213c",
      secondary: "#4b92ac",
      white: "#ffffff",
    },
    typography: (theme) => ({}),
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
