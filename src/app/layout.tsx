import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIFlow',
  description: 'One AI interface connected to many authorized providers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
