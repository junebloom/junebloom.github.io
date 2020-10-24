const { colors } = require("tailwindcss/defaultTheme");

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
          100: "#EFEFFE",
          500: "#6F75F6",
          600: "#595EE6",
          900: "#191EA2",
        },
        red: {
          ...colors.red,
          400: "#FF79A1",
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
