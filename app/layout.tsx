import type { Metadata } from 'next';
import './globals.css';   // ← This is the correct path

export const metadata: Metadata = {
  title: "HR Portal",
  description: "Enterprise HR Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}