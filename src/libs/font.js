import { Poppins } from 'next/font/google';

export const poppins = Poppins({
  weight: ['300', '500', '600'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['STXihei', 'Helvetica', 'Arial', 'sans-serif'],
  variable: '--font-poppins',
});
