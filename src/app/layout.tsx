import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AtleticaHub',
  description: 'Portal da Atlética',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex min-h-screen bg-black text-white`}>
        <CartProvider>
          <Sidebar />
          <main className="flex-1 p-8 ml-64">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}