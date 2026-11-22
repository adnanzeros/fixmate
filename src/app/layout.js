
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata = {
  title: {
    default: 'FixMate | Device & Home Appliance Repair',
    template: '%s | FixMate',
  },
  description:
    'Book verified technicians for phone, laptop, AC, fridge, TV and wiring repairs. Track every job and pay only after the work is done.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
