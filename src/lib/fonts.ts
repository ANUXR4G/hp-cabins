import { Inter } from 'next/font/google';

/** Inter substitutes BMW Type Next Latin (700 display / 300 body). */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '700'],
});
