import type { Metadata } from 'next';
import { Inter, Geist } from "next/font/google"
import './globals.css';
import Header from '../components/header/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Enter Planner',
  description: 'Plan your time easily',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${inter.className} antialiased`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 overflow-auto">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
