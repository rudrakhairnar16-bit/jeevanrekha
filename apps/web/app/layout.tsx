import type { Metadata } from 'next';
import './globals.css';
import './cinematic-rescue.css';
import './prototype.css';
export const metadata: Metadata = {
  title: 'JeevanRekha — Care, without compromise.',
  description: 'A concept for consent-controlled health access, emergency continuity and privacy-preserving public health. Not an official government service.',
};
export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
