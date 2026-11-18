import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CollectFlow — Automatic Fee, Instalment & Subscription Collections',
  description: 'The unified payment collection platform built for Indian businesses: Schools, Coaching Institutes, Mess Services, Mobile & Electronics stores, and Recurring Memberships.',
  keywords: 'fee collection, recurring payment, upi autopay, enach, instalment collection, indian saas, collectflow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
        {children}
      </body>
    </html>
  );
}
