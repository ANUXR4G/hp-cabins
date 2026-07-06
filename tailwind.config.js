/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#111111",
          light: "#222222",
          dark: "#0a0a0a",
        },
        gold: {
          DEFAULT: "#017501",
          light: "#029a02",
          dark: "#015401",
        },
        crimson: {
          DEFAULT: "#017501",
          light: "#029a02",
          dark: "#015401",
        },
        'premium-black': {
          DEFAULT: "#111111",
          light: "#222222",
          dark: "#0a0a0a",
        },
        'light-gray': "#F5F5F5",
        hairline: "#e0e0e0",
        'hairline-strong': "#cccccc",
        body: "#555555",
        'body-strong': "#333333",
        muted: "#888888",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.15', fontWeight: '700' }],
        'title-lg': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'title-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '400' }],
        'title-sm': ['1.125rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      letterSpacing: {
        label: '0.15em',
        nav: '0.05em',
      },
      spacing: {
        section: '6rem',
        xxl: '4rem',
      },
      maxWidth: {
        editorial: '90rem',
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        md: '6px',
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
