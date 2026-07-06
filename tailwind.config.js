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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-poppins)", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
