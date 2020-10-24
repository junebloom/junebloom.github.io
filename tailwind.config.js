const { colors } = require("tailwindcss/defaultTheme");
const { variants } = require("tailwindcss/defaultConfig");

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      colors: {
        indigo: {
          ...colors.indigo,
          100: "#efeffe",
          400: "#8a90ff",
          500: "#6f75f6",
          600: "#595ee6",
          900: "#191ea2",
        },
        red: {
          ...colors.red,
          400: "#ff79a1",
          500: "#ff5588",
        },
      },
    },
  },
  variants: {
    textColor: [...variants.textColor, "group-hover"],
  },
  plugins: [],
};
