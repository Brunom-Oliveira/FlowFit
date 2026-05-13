import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: '800', color: 'var(--accent)', lineHeight: 1, marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Página não encontrada</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
        A página que você procura não existe ou foi movida. Que tal voltar e continuar suas compras?
      </p>
      <Link href="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
        Voltar ao Início
      </Link>
    </div>
  );
}
