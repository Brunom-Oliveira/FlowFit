import { Package, Users, Activity, Settings, LogOut, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: 'var(--bg-primary)' }}>
      
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: '280px', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', padding: '2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', letterSpacing: '0.2em' }}>
            FLOWFIT <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ADMIN</span>
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/admin" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)', padding: '0.75rem 1rem' }}>
            <Activity size={20} /> Visão Geral
          </Link>
          <Link href="/admin/pedidos" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', padding: '0.75rem 1rem' }}>
            <ShoppingBag size={20} /> Pedidos
          </Link>
          <Link href="/admin/produtos" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', padding: '0.75rem 1rem' }}>
            <Package size={20} /> Produtos
          </Link>
          <Link href="/admin/clientes" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', padding: '0.75rem 1rem' }}>
            <Users size={20} /> Clientes
          </Link>
          <Link href="/admin/configuracoes" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', padding: '0.75rem 1rem', marginTop: '2rem' }}>
            <Settings size={20} /> Configurações
          </Link>
          <form action="/api/logout" method="POST">
            <button type="submit" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ef4444', padding: '0.75rem 1rem', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}>
              <LogOut size={20} /> Sair da Conta
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main" style={{ flex: 1, backgroundColor: 'var(--bg-primary)', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
