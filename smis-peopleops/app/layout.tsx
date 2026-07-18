import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SMIS PeopleOps',
  description: 'Leave, comp-off, holiday and department-head approval management for St. Mary\'s Institutions.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
