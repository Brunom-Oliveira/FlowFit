"use client";

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Pedidos e Pagamentos',
    q: 'Quais são as formas de pagamento aceitas?',
    a: 'Aceitamos pagamentos via Pix (com aprovação instantânea e 5% de desconto especial) e Cartão de Crédito em até 12x (sendo até 6x sem juros).'
  },
  {
    category: 'Pedidos e Pagamentos',
    q: 'Como funciona o sistema de pontos do Clube FLOWVIP?',
    a: 'A cada R$ 10,00 em compras, você ganha 1 Ponto VIP automaticamente. Ao acumular 150 pontos, você pode resgatar um desconto direto de R$ 15,00 na sua próxima sacola!'
  },
  {
    category: 'Entrega e Rastreamento',
    q: 'Qual é o prazo médio de entrega?',
    a: 'O prazo varia de acordo com o seu CEP. Regiões Sul e Sudeste costumam receber entre 2 e 5 dias úteis via modalidade Expressa. Você pode simular o prazo exato na página de cada produto.'
  },
  {
    category: 'Entrega e Rastreamento',
    q: 'Como faço para rastrear minha entrega?',
    a: 'Assim que o pedido é faturado, disparamos o link de rastreamento exclusivo em tempo real direto para o seu WhatsApp e e-mail cadastrados.'
  },
  {
    category: 'Produtos e Tamanhos',
    q: 'As leggings da Flowfit ficam transparentes ao agachar?',
    a: 'Absolutamente não. Nossas peças são desenvolvidas com tecidos premium de alta gramatura e tecnologia Zero Transparência, garantindo total segurança nos treinos mais intensos.'
  },
  {
    category: 'Produtos e Tamanhos',
    q: 'Como descubro meu tamanho ideal?',
    a: 'Em cada página de produto, oferecemos nosso exclusivo Provador Virtual por Inteligência Artificial. Basta inserir seu peso, altura e biotipo para receber a recomendação exata da peça.'
  }
];

export function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container section" style={{ paddingTop: '120px', maxWidth: '850px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Tire Suas Dúvidas
        </span>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', marginTop: '0.5rem', marginBottom: '1rem' }}>
          Perguntas Frequentes
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Reunimos as principais respostas sobre o ecossistema Flowfit para facilitar a sua jornada.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '10px',
                border: `1px solid ${isOpen ? 'var(--accent)' : 'var(--border-color)'}`,
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: isOpen ? 'bold' : 'normal'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)', backgroundColor: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                    {faq.category}
                  </span>
                  <span style={{ fontSize: '1.05rem' }}>{faq.q}</span>
                </div>

                <ChevronDown
                  size={20}
                  style={{
                    color: isOpen ? 'var(--accent)' : 'var(--text-secondary)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0
                  }}
                />
              </button>

              {isOpen && (
                <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '2.5rem', backgroundColor: 'rgba(229, 203, 179, 0.03)', borderRadius: '12px', border: '2px dashed var(--border-color)', textAlign: 'center' }}>
        <HelpCircle size={32} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Ainda não encontrou sua resposta?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Nosso time de atendimento VIP está online e a postos para te esclarecer tudo em tempo real.
        </p>
        <Link href="/contato" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
          Falar com Atendente
        </Link>
      </div>
    </div>
  );
}
