const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        slideLeft: {
          "0%": { transform: "translateX(initial)", opacity: 0 },
          "100%": { transform: "translateX(0%)", opacity: 1 },
        },
      },
      animation: {
        "slide-left": "slideLeft 0.5s ease forwards",
      },
    },
    colors: {
      ...colors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
