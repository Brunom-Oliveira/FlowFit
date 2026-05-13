import Link from 'next/link';
import { getStoreSocialLinksAction } from '../app/actions/store-config';

// Componentes SVG Nativos (Bypass Lucide para evitar falhas de build com marcas registradas)
const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TiktokIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

// 🚀 CONSULTORIA ENTERPRISE: ENGAGEMENT SOCIAL DINÂMICO (CRO)
// Consome assincronamente da Vercel Edge os links de redes sociais configurados
// no painel administrativo, potencializando a retenção e fidelidade de compradoras.
export async function Footer() {
  // Extração reativa paralela e garantida com fallback nativo
  let socialLinks = {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
  };

  try {
    const fetched = await getStoreSocialLinksAction();
    if (fetched) socialLinks = fetched;
  } catch (err) {
    console.warn('Rodapé utilizando links sociais de fallback da Borda.');
  }

  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', marginTop: '4rem' }}>
      <div className="container footer-content" style={{ padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Coluna 1: Marca & Identidade */}
        <div className="footer-brand" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
          <div className="logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Link href="/" className="logo" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '1px' }}>
              FLOWFIT
            </Link>
            <span className="logo-slogan" style={{ fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--accent)', fontWeight: 'bold', marginTop: '0.2rem' }}>
              VISTA SUA FORÇA
            </span>
          </div>
          <p className="footer-desc" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
            Moda fitness feminina de alta tecnologia. Conforto térmico, compressão inteligente e zero transparência para treinos de elite.
          </p>
        </div>

        {/* Coluna 2: Coleções Premium */}
        <div className="link-column" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Coleções Premium</h4>
            <Link href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Leggings Sculpt</Link>
            <Link href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Tops de Alta Sustentação</Link>
            <Link href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Lançamentos de Inverno</Link>
            <Link href="/shop" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>Outlet VIP (Até 50% OFF)</Link>
          </div>

        {/* Coluna 3: Atendimento */}
        <div className="link-column" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Atendimento</h4>
            <Link href="/contato" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Fale Conosco</Link>
            <Link href="/trocas" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Trocas e Devoluções</Link>
            <Link href="/faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Perguntas Frequentes</Link>
          </div>

        {/* Coluna 4: Redes Sociais */}
        <div className="link-column social-column" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Siga a Força</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0, maxWidth: '200px' }}>
              Faça parte da nossa comunidade VIP e acompanhe os bastidores da produção.
            </p>
            
            <div className="social-icons-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              
              {/* Instagram */}
              <a 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Instagram FlowFit"
                style={{ 
                  width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899',
                  border: '1px solid rgba(236, 72, 153, 0.2)', transition: 'all 0.2s ease'
                }}
              >
                <InstagramIcon size={18} />
              </a>

              {/* Facebook */}
              <a 
                href={socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Facebook FlowFit"
                style={{ 
                  width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6',
                  border: '1px solid rgba(59, 130, 246, 0.2)', transition: 'all 0.2s ease'
                }}
              >
                <FacebookIcon size={18} />
              </a>

              {/* TikTok */}
              <a 
                href={socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                title="TikTok FlowFit"
                style={{ 
                  width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.2s ease', textDecoration: 'none',
                  fontWeight: 'bold', fontSize: '0.9rem'
                }}
              >
                <TiktokIcon size={18} />
              </a>

            </div>
          </div>

      </div>

      {/* Direitos e Assinatura */}
      <div className="footer-bottom container" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Flowfit Storefront Premium. Plataforma gerenciada em tempo real sob Vercel Edge.</p>
      </div>
    </footer>
  );
}
