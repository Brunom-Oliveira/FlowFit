import type { Metadata } from 'next';
import { FAQClient } from './FAQClient';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes | Flowfit Premium',
  description: 'Tire suas dúvidas sobre pedidos, tamanhos, entregas, pagamentos e o clube FLOWVIP. Atendimento VIP Flowfit.',
  openGraph: {
    title: 'Perguntas Frequentes | Flowfit Premium',
    description: 'Tire suas dúvidas sobre pedidos, tamanhos, entregas e pagamentos.',
  },
};

export default function FAQPage() {
  return <FAQClient />;
}


