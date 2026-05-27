import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // NKOM brand palette — primary/neutral/charcoal use CSS variables so dark mode remaps automatically
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          50: "#E8EEF5",
          100: "#C5D3E5",
          200: "#9FB4D0",
          300: "#7895BA",
          400: "#5A7DAA",
          500: "#1E3A5F",
          600: "#1A3355",
          700: "#152B48",
          800: "#10223A",
          900: "#0B192D",
        },
        terracotta: {
          DEFAULT: "#C75B39",
          50: "#FAEEE9",
          100: "#F2D1C5",
          200: "#E8AE9B",
          300: "#DE8B71",
          400: "#D27050",
          500: "#C75B39",
          600: "#B34F30",
          700: "#954227",
          800: "#77351F",
          900: "#592817",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FBF5E0",
          100: "#F5E7B3",
          200: "#EFD880",
          300: "#E9C94D",
          400: "#E4BD26",
          500: "#D4AF37",
          600: "#BF9D2F",
          700: "#A08426",
          800: "#816A1E",
          900: "#625116",
        },
        neutral: {
          DEFAULT: "rgb(var(--color-neutral) / <alpha-value>)",
        },
        charcoal: {
          DEFAULT: "rgb(var(--color-charcoal) / <alpha-value>)",
        },
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
