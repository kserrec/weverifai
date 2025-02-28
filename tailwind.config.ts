import type { Config } from "tailwindcss";
import { theme as customTheme } from "./src/styles/theme";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: customTheme.colors.primary,
        secondary: customTheme.colors.secondary,
        background: customTheme.colors.background,
        header: customTheme.colors.header,
        text: customTheme.colors.text,
        muted: customTheme.colors.muted,
        border: customTheme.colors.border,
        hover: customTheme.colors.hover,
        disabled: customTheme.colors.disabled,
      },
      boxShadow: {
        light: customTheme.shadows.light,
        dark: customTheme.shadows.dark,
        medium: customTheme.shadows.medium,
        mediumDark: customTheme.shadows.mediumDark,
      },
      screens: {
        mobile: customTheme.breakpoints.mobile,
        tablet: customTheme.breakpoints.tablet,
        desktop: customTheme.breakpoints.desktop,
      },
      spacing: {
        header: customTheme.spacing.header,
        'content-desktop': customTheme.spacing.contentPadding.desktop,
        'content-mobile': customTheme.spacing.contentPadding.mobile,
      },
      fontFamily: {
        sans: customTheme.typography.fontFamily.split(', '),
      },
      fontSize: {
        'xs': customTheme.typography.sizes.small,
        'sm': customTheme.typography.sizes.base,
        'base': customTheme.typography.sizes.base,
        'lg': customTheme.typography.sizes.large,
        'xl': customTheme.typography.sizes.xlarge,
        '2xl': customTheme.typography.sizes.xxlarge,
      },
      transitionTimingFunction: {
        DEFAULT: 'ease',
      },
      transitionDuration: {
        DEFAULT: '300ms',
        fast: '200ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
