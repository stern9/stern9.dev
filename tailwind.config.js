const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.js", "./components/**/*.js", "./lib/**/*.js"],
  theme: {
    extend: {
      colors: {
        // Brand colors. Extended (not replaced) so Tailwind's default palette
        // (zinc, red, green, ...) keeps working.
        primary: "#0e213c",
        secondary: "#4b92ac",
        accent: {
          DEFAULT: "#2f7a96",
          light: "#6fb3cc",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-links": theme("colors.accent.DEFAULT"),
            "--tw-prose-invert-links": theme("colors.accent.light"),
            a: {
              textDecoration: "underline",
              textDecorationThickness: "1px",
              textUnderlineOffset: "3px",
              fontWeight: "500",
            },
            "a:hover": { textDecorationThickness: "2px" },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            "h2, h3, h4": { scrollMarginTop: "6rem" },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
