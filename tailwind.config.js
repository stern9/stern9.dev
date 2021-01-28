module.exports = {
  darkMode: "class",
  purge: ["./pages/**/*.js", "./components/**/*.js", "./lib/**/*.js"],
  theme: {
    typography: (theme) => ({}),
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
