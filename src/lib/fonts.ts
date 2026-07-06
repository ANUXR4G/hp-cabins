import { Saira_Condensed, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';

/** Bugatti Display substitute — uppercase, wide-tracked headlines. */
export const displayFont = Saira_Condensed({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400'],
});

/** Bugatti Text Regular substitute — serif body copy. */
export const bodyFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400'],
});

/** Bugatti Monospace substitute — nav, buttons, captions. */
export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400'],
});
