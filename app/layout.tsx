import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Monitoring Air Coolant - YKK Group',
  description: 'Sistem monitoring pH, TDS, dan Suhu air coolant mesin Wasino SE-52N2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
