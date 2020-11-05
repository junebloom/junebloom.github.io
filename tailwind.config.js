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
          color: "#393C69",
          h1: {
            color: theme("colors.indigo.500"),
            fontSize: theme("fontSize.5xl"),
            fontWeight: theme("fontWeight.black"),
            lineHeight: theme("lineHeight.none"),
            marginTop: theme("spacing.16"),
            marginBottom: theme("spacing.8"),
          },
          h2: {
            color: theme("colors.indigo.500"),
            fontSize: theme("fontSize.3xl"),
            fontWeight: theme("fontWeight.bold"),
            lineHeight: theme("lineHeight.none"),
            marginTop: theme("spacing.12"),
            marginBottom: theme("spacing.6"),
          },
          h3: {
            color: theme("colors.indigo.600"),
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
            color: theme("colors.indigo.700"),
          },
          a: {
            color: theme("colors.red.500"),
            textDecorationLine: "none",
            "&:hover": {
              color: theme("colors.red.600"),
              textDecorationLine: "underline",
              textDecorationThickness: "2px",
            },
          },
          li: {
            margin: "0",
          },
          blockquote: {
            color: theme("colors.indigo.500"),
            background: theme("colors.indigo.200"),
            borderLeftColor: theme("colors.indigo.500"),
            borderRadius: theme("borderRadius.sm"),
            padding: theme("spacing.4"),
            p: {
              margin: "0",
            },
          },
          code: {
            background: theme("colors.indigo.100"),
            color: theme("colors.indigo.600"),
            fontWeight: theme("fontWeight.normal"),
            borderRadius: theme("borderRadius.default"),
            padding: theme("spacing.1"),
            whiteSpace: "pre",
          },
          "code::before": {
            content: "none",
          },
          "code::after": {
            content: "none",
          },
          pre: {
            background: theme("colors.indigo.100"),
            color: theme("colors.indigo.600"),
            lineHeight: theme("lineHeight.normal"),
          },
        },
      },
    }),
    extend: {
      colors: {
        indigo: {
          100: "#F8F8FF",
          200: "#f5f5ff",
          300: "#BFC2FF",
          400: "#9399ff",
          500: "#6f75f6",
          600: "#5156EB",
          700: "#4141CF",
          800: "#3B34BB",
          900: "#2D239E",
        },
        red: {
          100: "#FFE9F0",
          200: "#FFCDDD",
          300: "#FFA3BF",
          400: "#ff79a1",
          500: "#ff5588",
          600: "#E93067",
          700: "#D42257",
          800: "#BC1C4C",
          900: "#9C1E44",
        },
      },
    },
  },
  variants: {
    textColor: [...variants.textColor, "group-hover"],
  },
  plugins: [require("@tailwindcss/typography")],
};
