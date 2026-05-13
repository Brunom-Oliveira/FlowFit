import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MessageCircle } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Flowfit - Vista sua Força',
    template: '%s | Flowfit Premium',
  },
  description: 'Moda fitness feminina premium. Leggings, tops e conjuntos com alta compressão e tecnologia dry-fit.',
  keywords: ['roupas fitness', 'leggings', 'moda feminina', 'academia', 'roupas de treino', 'moda fitness premium'],
  robots: { index: true, follow: true },
  openGraph: {
    siteName: 'Flowfit',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable}`}>
      <body className={`${inter.className}`}>
        <Providers>
          <div className="app-container">
            <Header />
            <main className="main-content">
              {children}
            </main>
            <Footer />

            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-float"
              title="Fale conosco no WhatsApp"
            >
              <MessageCircle size={28} />
            </a>
          </div>
        </Providers>
      </body>
    </html>
  );
}
