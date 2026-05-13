import Link from 'next/link';
import { Camera, Globe } from 'lucide-react';
import { getStoreSocialLinksAction } from '../app/actions/store-config';

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
      <div className="container footer-content" style={{ padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
        
        {/* Marca & Identidade */}
        <div className="footer-brand">
          <div className="logo-container" style={{ alignItems: 'flex-start', marginBottom: '1rem' }}>
            <Link href="/" className="logo" style={{ marginLeft: 0, textDecoration: 'none' }}>
              FLOWFIT
            </Link>
            <span className="logo-slogan" style={{ marginLeft: '0.1em', fontSize: '0.7rem', letterSpacing: '2px', color: 'var(--accent)' }}>
              VISTA SUA FORÇA
            </span>
          </div>
          <p className="footer-desc" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Moda fitness feminina de alta tecnologia. Conforto térmico, compressão inteligente e zero transparência para treinos de elite.
          </p>
        </div>

        {/* Links Rápidos: Coleções */}
        <div className="footer-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'space-between' }}>
          
          <div className="link-column" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Coleções Premium</h4>
            <Link href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Leggings Sculpt</Link>
            <Link href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Tops de Alta Sustentação</Link>
            <Link href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Lançamentos de Inverno</Link>
            <Link href="/shop" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>Outlet VIP (Até 50% OFF)</Link>
          </div>

          <div className="link-column" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Atendimento</h4>
            <Link href="/contato" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Fale Conosco</Link>
            <Link href="/trocas" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Trocas e Devoluções</Link>
            <Link href="/faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Perguntas Frequentes</Link>
          </div>

          {/* 🌟 COLUNA DINÂMICA DE REDES SOCIAIS (CONECTADA AO ADMIN) */}
          <div className="link-column social-column" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                <Camera size={18} />
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
                <Globe size={18} />
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
                🎵
              </a>

            </div>
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
