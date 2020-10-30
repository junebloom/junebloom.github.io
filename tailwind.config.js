const { colors } = require("tailwindcss/defaultTheme");
const { variants } = require("tailwindcss/defaultConfig");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.js"],
  theme: {
    typography: (theme) => ({
      default: {
        css: {
          h1: {
            color: theme("colors.indigo.500"),
            fontSize: theme("fontSize.5xl"),
            fontWeight: theme("fontWeight.black"),
            lineHeight: theme("lineHeight.none"),
            marginTop: theme("spacing.16"),
            marginBottom: theme("spacing.8"),
          },
          h2: {
            color: theme("colors.indigo.400"),
            fontSize: theme("fontSize.3xl"),
            fontWeight: theme("fontWeight.black"),
            lineHeight: theme("lineHeight.none"),
            marginTop: theme("spacing.12"),
            marginBottom: theme("spacing.6"),
          },
          h3: {
            color: theme("colors.indigo.500"),
            fontSize: theme("fontSize.2xl"),
            fontWeight: theme("fontWeight.normal"),
            lineHeight: theme("lineHeight.none"),
            marginTop: theme("spacing.8"),
            marginBottom: theme("spacing.4"),
          },
          h4: {
            color: theme("colors.indigo.600"),
            fontSize: theme("fontSize.base"),
            fontWeight: theme("fontWeight.bold"),
            lineHeight: theme("lineHeight.none"),
            marginTop: theme("spacing.8"),
            marginBottom: theme("spacing.4"),
          },
          strong: {
            color: theme("colors.indigo.900"),
          },
          a: {
            color: theme("colors.red.400"),
            textDecorationLine: "none",
            "&:hover": {
              color: theme("colors.red.500"),
              textDecorationLine: "underline",
              textDecorationThickness: "2px",
            },
          },
          blockquote: {
            color: theme("colors.indigo.500"),
            background: theme("colors.indigo.100"),
            borderLeftColor: theme("colors.indigo.500"),
            padding: theme("spacing.4"),
            p: {
              margin: "0",
            },
          },
          code: {
            background: "#f4f4ff",
            color: "#9399ff",
            fontWeight: theme("fontWeight.semibold"),
            borderRadius: theme("borderRadius.default"),
            padding: theme("spacing.1"),
          },
          "code::before": {
            content: "none",
          },
          "code::after": {
            content: "none",
          },
          pre: {
            background: "#f4f4ff",
            color: "#9399ff",
            lineHeight: theme("lineHeight.normal"),
          },
          "pre code": {
            fontWeight: theme("fontWeight.semibold"),
          },
        },
      },
    }),
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
  plugins: [require("@tailwindcss/typography")],
};
