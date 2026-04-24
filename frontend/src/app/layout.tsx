import type { Metadata } from 'next';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expense Tracker — Track Your Spending',
  description:
    'A production-quality expense tracker with idempotent submissions, real-time filtering, and precise money handling.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
