import type { Metadata } from 'next';
import { RefreshCcw, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Trocas e Devoluções | Flowfit Premium',
  description: 'Política de trocas e devoluções Flowfit. Primeira troca grátis, prazo de 30 dias e estorno rápido. Satisfação garantida.',
  openGraph: {
    title: 'Trocas e Devoluções | Flowfit Premium',
    description: 'Primeira troca grátis, prazo de 30 dias e estorno rápido.',
  },
};

export default function TrocasPage() {
  return (
    <div className="container section" style={{ paddingTop: '120px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Satisfação Garantida
        </span>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', marginTop: '0.5rem', marginBottom: '1rem' }}>
          Trocas e Devoluções
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Na Flowfit, sua primeira troca é 100% gratuita. Garantimos um processo simples, rápido e sem burocracia.
        </p>
      </div>

      {/* Vantagens / Prazos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <RefreshCcw size={28} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
          <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>1ª Troca Grátis</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nós pagamos o frete de devolução e reenvio.</span>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <Clock size={28} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
          <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Prazo Estendido</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Até 30 dias corridos para solicitar a troca.</span>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <ShieldCheck size={28} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
          <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Estorno Rápido</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reembolso processado em até 3 dias úteis.</span>
        </div>
      </div>

      {/* Como Funciona */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '2rem', color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Passo a Passo para Solicitar
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(229, 203, 179, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, border: '1px solid var(--accent)' }}>
              1
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Acesse nosso canal de suporte</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Tenha em mãos o número do seu pedido (iniciado com #) e o CPF cadastrado na compra.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(229, 203, 179, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, border: '1px solid var(--accent)' }}>
              2
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Receba o Código de Postagem</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Geramos um código dos Correios instantaneamente. Basta levar a peça na embalagem original (ou similar) até a agência mais próxima.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(229, 203, 179, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, border: '1px solid var(--accent)' }}>
              3
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Escolha sua Nova Peça ou Estorno</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Assim que a peça devolvida entrar em nosso centro logístico, liberamos um vale-compras com bônus ou realizamos o estorno via Pix/Cartão.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Condições e Dúvidas */}
      <div style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Condições da Peça</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px', marginBottom: '1.5rem' }}>
          Para que a troca seja autorizada, o produto deve conter a etiqueta original afixada, não apresentar indícios de uso, lavagem ou odores.
        </p>
        <Link href="/contato" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
          Iniciar Solicitação de Troca
        </Link>
      </div>

    </div>
  );
}
