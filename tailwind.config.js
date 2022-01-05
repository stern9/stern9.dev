const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  purge: ["./pages/**/*.js", "./components/**/*.js", "./lib/**/*.js"],
  theme: {
    colors: {
      primary: "#0e213c",
      secondary: "#4b92ac",
      white: "#ffffff",
    },
    extend: {
      fontFamily: {
        sans: ["Nunito", ...fontFamily.sans],
      },
    },
  },
  mode: 'jit',
  variants: {},
};
