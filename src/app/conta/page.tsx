import { prisma } from '../../lib/prisma';
import { getSession } from '../../lib/session';
import { redirect } from 'next/navigation';
import { Package, Award, User, LogOut, ArrowUpRight, CheckCircle2, Truck, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import CompleteProfileForm from './CompleteProfileForm';

export const revalidate = 0;

export default async function CustomerAccountPage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  // Busca a cliente e todas as suas compras com relacionamentos completos
  const [user, recommendedProducts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: String(session.userId) },
      include: {
        orders: {
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: { images: true }
                    }
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    }),
    // Recomendações de Cross-sell (Fase 8)
    prisma.product.findMany({
      take: 3,
      include: { images: true },
      orderBy: { price: 'desc' } // Sugere itens de ticket premium
    })
  ]);

  if (!user) {
    redirect('/login');
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  // Status mapping
  const statusMap: Record<string, { label: string; color: string; bg: string; stepIndex: number }> = {
    PENDING: { label: 'Aguardando Pagamento', color: 'var(--text-secondary)', bg: 'rgba(255,255,255,0.05)', stepIndex: 0 },
    PAID: { label: 'Pagamento Aprovado', color: 'var(--accent)', bg: 'rgba(229, 203, 179, 0.1)', stepIndex: 1 },
    SHIPPED: { label: 'Em Trânsito', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.1)', stepIndex: 2 },
    DELIVERED: { label: 'Entregue', color: '#4ade80', bg: 'rgba(34, 197, 94, 0.1)', stepIndex: 3 },
    CANCELED: { label: 'Cancelado', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', stepIndex: -1 },
  };

  const timelineSteps = [
    { label: 'Pedido Realizado' },
    { label: 'Pagamento Aprovado' },
    { label: 'Em Transporte' },
    { label: 'Pacote Entregue' },
  ];

  const totalSpent = user.orders.reduce((acc, o) => acc + Number(o.totalAmount), 0);
  const loyaltyPoints = Math.floor(totalSpent / 10);

  return (
    <div style={{ padding: '10rem 2rem 6rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Cabeçalho da Conta */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <Award size={16} />
            <span>{totalSpent > 400 ? 'Membro FLOWVIP Premium' : 'Membro Flowfit'}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Olá, {user.name.split(' ')[0]}!</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Acompanhamento logístico em tempo real e benefícios exclusivos.</p>
        </div>

        <form action="/api/logout" method="POST">
          <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '8px', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>
            Sair da Conta
          </button>
        </form>
      </header>

      {!(user as any).isProfileComplete && (
        <CompleteProfileForm userName={user.name} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '3rem' }}>
        
        {/* Lado Esquerdo - Histórico de Pedidos e Rastreio */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={22} style={{ color: 'var(--accent)' }} /> Meus Pedidos & Rastreio
          </h2>

          {user.orders.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--accent)' }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Você ainda não realizou nenhuma compra.</p>
              <Link href="/shop" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {user.orders.map((order) => {
                const statusInfo = statusMap[order.status] || statusMap.PENDING;

                return (
                  <div key={order.id} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '2rem', overflow: 'hidden' }}>
                    
                    {/* Top do Cartão do Pedido */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.2rem', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pedido</span>
                        <div style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Data</span>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{formatDate(order.createdAt)}</div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total da Nota</span>
                        <div style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: '1.1rem' }}>
                          {formatPrice(Number(order.totalAmount))}
                        </div>
                      </div>

                      <div>
                        <span style={{ 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '6px', 
                          backgroundColor: statusInfo.bg, 
                          color: statusInfo.color,
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          display: 'inline-block'
                        }}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* 🌟 BARRA DE RASTREIO VISUAL (TIMELINE - FASE 2) */}
                    {order.status !== 'CANCELED' && (
                      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 'bold' }}>
                          Progresso Logístico:
                        </span>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                          
                          {/* Linha conectora de fundo */}
                          <div style={{ position: 'absolute', top: '12px', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 }} />
                          
                          {/* Linha preenchida de progresso */}
                          <div style={{ 
                            position: 'absolute', top: '12px', left: '10%', 
                            width: `${(Math.max(0, statusInfo.stepIndex) / (timelineSteps.length - 1)) * 80}%`, 
                            height: '2px', backgroundColor: 'var(--accent)', zIndex: 2,
                            transition: 'width 0.5s ease'
                          }} />

                          {timelineSteps.map((step, sIdx) => {
                            const isCompleted = sIdx <= statusInfo.stepIndex;
                            const isCurrent = sIdx === statusInfo.stepIndex;

                            return (
                              <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '80px' }}>
                                <div style={{ 
                                  width: '26px', height: '26px', borderRadius: '50%', 
                                  backgroundColor: isCompleted ? 'var(--accent)' : 'var(--bg-secondary)',
                                  border: `2px solid ${isCompleted ? 'var(--accent)' : 'var(--border-color)'}`,
                                  color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: 'bold', fontSize: '0.75rem',
                                  boxShadow: isCurrent ? '0 0 0 4px rgba(229, 203, 179, 0.2)' : 'none'
                                }}>
                                  {isCompleted ? '✓' : sIdx + 1}
                                </div>
                                <span style={{ fontSize: '0.7rem', color: isCurrent ? 'var(--accent)' : 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center', fontWeight: isCurrent ? 'bold' : 'normal' }}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}

                        </div>
                      </div>
                    )}

                    {/* Linhas de Itens Comprados com Imagens Reais */}
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                      Peças do Pacote:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {order.items.map((item, idx) => {
                        const product = item.variant?.product;
                        const imageUrl = product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&q=80';

                        return (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: '45px', height: '55px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
                                <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                  {product?.name || 'Peça Exclusiva'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                  Tamanho: <strong style={{ color: 'var(--accent)' }}>{item.variant?.size || 'M'}</strong> | Quantidade: {item.quantity}
                                </div>
                              </div>
                            </div>

                            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                              {formatPrice(Number(item.price) * item.quantity)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* 🌟 MÓDULO DE RECOMENDAÇÃO CROSS-SELL (FASE 8) */}
          <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Recomendações para o seu Treino</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {recommendedProducts.map((prod) => (
                <Link key={prod.id} href={`/product/${prod.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', transition: 'transform 0.2s ease' }} className="product-card-simple">
                  <div style={{ height: '180px', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
                    <img src={prod.images?.[0]?.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {prod.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold', marginTop: '0.25rem' }}>
                      {formatPrice(Number(prod.price))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Lado Direito - Widgets e Fidelidade */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Clube VIP */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(229, 203, 179, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent)' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Clube FLOWVIP</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Acumule pontos e troque por descontos exclusivos.</p>
            
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.5rem' }}>
              {loyaltyPoints} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>pts</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#22c55e' }}>Você ganha 1 ponto a cada R$ 10 em compras</p>
          </div>

          {/* Dados Pessoais */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} style={{ color: 'var(--accent)' }} /> Dados da Conta
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Nome</span>
                <strong>{user.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>E-mail de Cadastro</span>
                <strong>{user.email}</strong>
              </div>
            </div>
          </div>

          {/* Suporte */}
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Precisa de Ajuda?</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Atendimento expresso via WhatsApp para trocas ou dúvidas logísticas.</p>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none' }}>
              Falar com Suporte <ArrowUpRight size={14} />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
