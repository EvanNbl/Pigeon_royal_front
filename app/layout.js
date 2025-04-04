// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from './context/CartContext';
import CartButton from './components/CartButton';
import Cart from './components/Cart';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ma Boutique en Ligne",
  description: "Boutique e-commerce avec panier",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-sm py-4">
              <div className="container mx-auto px-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Ma Boutique</h1>
                <CartButton />
              </div>
            </header>
            
            <main className="flex-grow">
              {children}
            </main>
            
            <footer className="bg-gray-100 py-6 mt-10">
              <div className="container mx-auto px-4 text-center text-gray-600">
                &copy; {new Date().getFullYear()} Ma Boutique en Ligne - Tous droits réservés
              </div>
            </footer>
            
            <Cart />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}