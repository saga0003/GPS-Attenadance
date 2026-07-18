import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMIS PeopleOps',
  description: 'Leave, attendance and employee management for St. Mary\'s institutions.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
