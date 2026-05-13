import type { Metadata } from 'next';
import { ContatoForm } from './ContatoForm';

export const metadata: Metadata = {
  title: 'Fale Conosco | Flowfit Premium',
  description: 'Atendimento VIP Flowfit. Tire dúvidas sobre trocas, pedidos, tamanhos ou qualquer assunto relacionado à sua experiência de compra.',
  openGraph: {
    title: 'Fale Conosco | Flowfit Premium',
    description: 'Atendimento VIP Flowfit. Tire dúvidas sobre trocas, pedidos, tamanhos.',
  },
};

export default function ContatoPage() {
  return <ContatoForm />;
}


