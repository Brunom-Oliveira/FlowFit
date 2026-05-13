import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MessageCircle } from 'lucide-react';
import { getStoreWhatsAppAction } from './actions/store-config';

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

// 🚀 CONSULTORIA ENTERPRISE: LAYOUT REATIVO E DINÂMICO (Fase 11 e 12)
// Consome assincronamente da Vercel Edge o WhatsApp Oficial da Loja configurado
// em tempo real pela diretoria no painel administrativo, eliminando hardcoded strings.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Extração assíncrona segura com tipagem preditiva
  const activeWhatsAppNumber = await getStoreWhatsAppAction();
  const dynamicWhatsAppLink = `https://wa.me/${activeWhatsAppNumber}`;

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

            {/* 🌟 BOTÃO FLUTUANTE DE ATENDIMENTO VIP CONECTADO À BORDA */}
            <a
              href={dynamicWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-float"
              title="Fale conosco com suporte exclusivo no WhatsApp"
              style={{
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <MessageCircle size={28} />
            </a>
          </div>
        </Providers>
      </body>
    </html>
  );
}
