import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const params = await searchParams;
  const orderId = params.orderId || 'FLOW-EXPRESS';

  return (
    <div style={{ padding: '12rem 2rem 8rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#22c55e' }}>
        <CheckCircle2 size={48} />
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
        PEDIDO CONFIRMADO!
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
        Código: {orderId.slice(0, 8).toUpperCase()}
      </p>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
        Parabéns! Sua compra foi processada com sucesso. Em breve você receberá um e-mail com a confirmação do pagamento e o código de rastreio exclusivo da sua remessa Flowfit.
      </p>

      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '3rem', textAlign: 'left' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Próximos Passos:</h3>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Separação expressa no nosso centro logístico em até 24h.</li>
          <li>Embalagem premium perfumada com nossa essência exclusiva.</li>
          <li>Entrega via transportadora segurada direto no seu endereço.</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/shop" className="btn btn-primary" style={{ padding: '1rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          Continuar Comprando <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
