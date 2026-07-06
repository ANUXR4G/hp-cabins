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
        parchment: "#f5f5f7",
        hairline: "#e0e0e0",
        'hairline-strong': "#cccccc",
        ink: "#111111",
        body: "#444444",
        'body-strong': "#333333",
        muted: "#888888",
        'muted-soft': "#aaaaaa",
        'surface-card': "#fafafa",
        'surface-soft': "#f0f0f0",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-body)", "Garamond", "Times New Roman", "serif"],
        sans: ["var(--font-body)", "Garamond", "Times New Roman", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '0.25em', fontWeight: '400' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '0.1875em', fontWeight: '400' }],
        'display-md': ['2rem', { lineHeight: '1.2', letterSpacing: '0.125em', fontWeight: '400' }],
        'display-sm': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.09375em', fontWeight: '400' }],
        'wordmark': ['0.875rem', { lineHeight: '1', letterSpacing: '0.42857em', fontWeight: '400' }],
        'title-md': ['1.25rem', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'caption-mono': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.1818em', fontWeight: '400' }],
        'button-mono': ['0.875rem', { lineHeight: '1', letterSpacing: '0.17857em', fontWeight: '400' }],
        'nav-mono': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.16667em', fontWeight: '400' }],
      },
      letterSpacing: {
        display: '0.125em',
        wordmark: '0.42857em',
        button: '0.17857em',
        caption: '0.1818em',
        nav: '0.16667em',
      },
      spacing: {
        section: '7.5rem',
        'section-sm': '5rem',
      },
      maxWidth: {
        editorial: '80rem',
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
