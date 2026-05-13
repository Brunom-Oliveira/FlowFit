import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo-container" style={{ alignItems: 'flex-start' }}>
            <Link href="/" className="logo" style={{ marginLeft: 0 }}>
              FLOWFIT
            </Link>
            <span className="logo-slogan" style={{ marginLeft: '0.1em' }}>VISTA SUA FORÇA</span>
          </div>
          <p className="footer-desc">A marca de quem não tem desculpas.</p>
        </div>
        <div className="footer-links">
          <div className="link-column">
            <h4>Coleções</h4>
            <Link href="/shop">Leggings & Tops</Link>
            <Link href="/shop">Lançamentos</Link>
            <Link href="/shop">Outlet Premium</Link>
          </div>
          <div className="link-column">
            <h4>Ajuda</h4>
            <Link href="/contato">Contato</Link>
            <Link href="/trocas">Trocas e Devoluções</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; 2026 Flowfit. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
