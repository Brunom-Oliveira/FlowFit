"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Package, Award, User, LogOut, ArrowUpRight, CheckCircle2, Truck, ShoppingBag, Sparkles, Gift, Flame, ChevronDown, ChevronUp, Bell, Edit3, Save, X } from 'lucide-react';
import { fetchTrackingEvents, ShippingTrackingResponse } from '../../lib/enterprise/shipping';
import { updateCustomerProfileAction } from '../actions/profile';

interface AccountClientDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    addressZip?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressComplement?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    addressState?: string;
    isProfileComplete?: boolean;
    orders: Array<{
      id: string;
      totalAmount: number;
      status: string;
      createdAt: Date;
      items: Array<{
        quantity: number;
        price: number;
        productName: string;
        size: string;
        imageUrl: string;
      }>;
    }>;
  };
  recommendedProducts: Array<{
    id: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string;
  }>;
}

// 🚀 CONSULTORIA ENTERPRISE: GESTÃO CADASTRAL COMPLETA (Progressive Profiling)
// Componente evoluído com suporte a edição autônoma de dados logísticos e contato WhatsApp.
export function AccountClientDashboard({ user, recommendedProducts }: AccountClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pedidos' | 'vip' | 'dados'>('dashboard');
  
  // Estados de Rastreamento
  const [loadingTracking, setLoadingTracking] = useState<boolean>(false);
  const [trackingData, setTrackingData] = useState<ShippingTrackingResponse | null>(null);
  const [showTrackingDetails, setShowTrackingDetails] = useState<boolean>(false);

  // 🌟 ESTADOS DE EDIÇÃO E GERENCIAMENTO DE ENDEREÇO VIP (SPRINT COMPLEMENTAR)
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState<string | null>(null);
  const [profileErrorMessage, setProfileErrorMessage] = useState<string | null>(null);

  // Formulário Local Controlado
  const [formData, setFormData] = useState({
    phone: user.phone || '',
    addressZip: user.addressZip || '',
    addressStreet: user.addressStreet || '',
    addressNumber: user.addressNumber || '',
    addressComplement: user.addressComplement || '',
    addressNeighborhood: user.addressNeighborhood || '',
    addressCity: user.addressCity || '',
    addressState: user.addressState || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
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

  // Regras VIP
  const totalSpent = user.orders.reduce((acc, o) => acc + Number(o.totalAmount), 0);
  const loyaltyPoints = Math.floor(totalSpent / 10);
  const cashbackAvailable = totalSpent * 0.05;

  let vipTier = 'Silver';
  let nextTierThreshold = 500;
  let nextTierName = 'Gold';
  let tierProgress = Math.min(100, (totalSpent / 500) * 100);

  if (totalSpent >= 500 && totalSpent < 1200) {
    vipTier = 'Gold';
    nextTierThreshold = 1200;
    nextTierName = 'Black Diamond';
    tierProgress = Math.min(100, ((totalSpent - 500) / 700) * 100);
  } else if (totalSpent >= 1200) {
    vipTier = 'Black Diamond';
    nextTierThreshold = totalSpent;
    nextTierName = 'Nível Máximo';
    tierProgress = 100;
  }

  const handleLoadTracking = useCallback(async (orderId: string) => {
    if (trackingData) {
      setShowTrackingDetails(!showTrackingDetails);
      return;
    }
    setLoadingTracking(true);
    setShowTrackingDetails(true);
    try {
      const data = await fetchTrackingEvents(orderId);
      setTrackingData(data);
    } catch (err) {
      console.warn('Falha pontual na simulação de rastreamento', err);
    } finally {
      setLoadingTracking(false);
    }
  }, [trackingData, showTrackingDetails]);

  // 🚀 AÇÃO DE SALVAMENTO DE PERFIL DO CLIENTE
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMessage(null);
    setProfileErrorMessage(null);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      payload.set(key, val);
    });

    try {
      const res = await updateCustomerProfileAction(payload);
      if (res.success) {
        setProfileSuccessMessage('Endereço e Contato atualizados com sucesso na nuvem Vercel.');
        setIsEditingProfile(false);
      } else {
        setProfileErrorMessage(res.error || 'Erro ao persistir informações no banco.');
      }
    } catch (err) {
      setProfileErrorMessage('Falha de conexão ao sincronizar perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const latestOrder = user.orders[0];

  return (
    <div className="account-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', contentVisibility: 'auto' }}>
      
      {/* BANNER NOTIFICAÇÕES INTELIGENTES */}
      {latestOrder && latestOrder.status !== 'CANCELED' && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bell size={18} style={{ color: '#60a5fa', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <strong>Aviso Logístico Expresso:</strong> O seu pedido mais recente <strong>#{latestOrder.id.slice(0,8).toUpperCase()}</strong> encontra-se com movimentação prioritária ativa.
            </span>
          </div>
          <button 
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              handleLoadTracking(latestOrder.id);
            }} 
            style={{ padding: '0.3rem 0.8rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Acompanhar Rota
          </button>
        </div>
      )}

      {/* BANNER SUPERIOR DE GAMIFICAÇÃO */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '2.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(229, 203, 179, 0.05)', filter: 'blur(30px)' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', zIndex: 10, position: 'relative' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', backgroundColor: 'rgba(229, 203, 179, 0.15)', color: 'var(--accent)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              <Award size={14} /> Membro FLOWVIP {vipTier}
            </div>
            
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Área Exclusiva VIP
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px', lineHeight: '1.5' }}>
              Você está acumulando vantagens exclusivas a cada batimento cardíaco nos seus treinos.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ padding: '1.2rem', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', minWidth: '140px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Cashback Disponível</span>
              <strong style={{ fontSize: '1.6rem', color: '#22c55e', fontWeight: 'bold', display: 'block' }}>
                {formatPrice(cashbackAvailable)}
              </strong>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Para abater no look de hoje</span>
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', minWidth: '140px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Pontos Fitness</span>
              <strong style={{ fontSize: '1.6rem', color: 'var(--accent)', fontWeight: 'bold', display: 'block' }}>
                {loyaltyPoints} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>pts</span>
              </strong>
              <span style={{ fontSize: '0.65rem', color: 'var(--accent)' }}>Troca liberada em cupons</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Progresso para o nível <strong style={{ color: 'var(--accent)' }}>{nextTierName}</strong>:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{vipTier === 'Black Diamond' ? '✓ Desbloqueio Máximo' : `${Math.floor(tierProgress)}%`}</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${tierProgress}%`, backgroundColor: 'var(--accent)', borderRadius: '10px', transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO DE ABAS */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'dashboard', label: 'Visão Geral', icon: Sparkles },
          { id: 'pedidos', label: `Meus Pedidos (${user.orders.length})`, icon: Package },
          { id: 'vip', label: 'Meus Benefícios VIP', icon: Gift },
          { id: 'dados', label: 'Dados da Conta', icon: User },
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.25rem', borderRadius: '8px',
                backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--border-color)' : 'transparent'}`,
                fontWeight: isActive ? 'bold' : 'normal', fontSize: '0.9rem',
                whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <IconComponent size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ABA 1: VISÃO GERAL */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={18} style={{ color: 'var(--accent)' }} /> Acompanhamento em Tempo Real
                </h3>
                {user.orders.length > 1 && (
                  <button type="button" onClick={() => setActiveTab('pedidos')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    Ver todos os pedidos →
                  </button>
                )}
              </div>

              {user.orders.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <ShoppingBag size={36} style={{ margin: '0 auto 1rem', color: 'var(--accent)', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>O seu armário Flowfit ainda aguarda o primeiro look.</p>
                  <Link href="/shop" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                    Explorar Lançamentos
                  </Link>
                </div>
              ) : (
                (() => {
                  const statusInfo = statusMap[latestOrder.status] || statusMap.PENDING;
                  return (
                    <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.8rem', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Última Compra</span>
                          <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-primary)' }}>#{latestOrder.id.slice(0,8).toUpperCase()}</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Data</span>
                          <strong>{formatDate(latestOrder.createdAt)}</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Valor</span>
                          <strong style={{ color: 'var(--accent)' }}>{formatPrice(Number(latestOrder.totalAmount))}</strong>
                        </div>
                        <div>
                          <span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: statusInfo.bg, color: statusInfo.color, fontWeight: 'bold', fontSize: '0.75rem' }}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {latestOrder.status !== 'CANCELED' && (
                        <div style={{ padding: '1.2rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 }} />
                            <div style={{ position: 'absolute', top: '10px', left: '10%', width: `${(Math.max(0, statusInfo.stepIndex) / 3) * 80}%`, height: '2px', backgroundColor: 'var(--accent)', zIndex: 2 }} />
                            {timelineSteps.map((st, idx) => (
                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '70px' }}>
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: idx <= statusInfo.stepIndex ? 'var(--accent)' : 'var(--bg-secondary)', border: `2px solid ${idx <= statusInfo.stepIndex ? 'var(--accent)' : 'var(--border-color)'}`, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.7rem' }}>
                                  {idx <= statusInfo.stepIndex ? '✓' : idx + 1}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: idx === statusInfo.stepIndex ? 'var(--accent)' : 'var(--text-secondary)', marginTop: '0.4rem', textAlign: 'center' }}>{st.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ marginBottom: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.2rem' }}>
                        <button
                          type="button"
                          onClick={() => handleLoadTracking(latestOrder.id)}
                          style={{
                            width: '100%', padding: '0.75rem', borderRadius: '8px',
                            backgroundColor: 'rgba(229, 203, 179, 0.05)', border: '1px solid rgba(229, 203, 179, 0.2)',
                            color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer'
                          }}
                        >
                          <Package size={16} /> 
                          {showTrackingDetails ? 'Ocultar Detalhes de Transporte' : 'Acompanhar Eventos da Transportadora em Tempo Real'}
                          {showTrackingDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {showTrackingDetails && (
                          <div style={{ marginTop: '1rem', padding: '1.2rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            {loadingTracking ? (
                              <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--accent)', fontSize: '0.85rem' }}>Conectando com os satélites da transportadora...</div>
                            ) : trackingData ? (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                                  <div><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Empresa Logística</span><strong style={{ fontSize: '0.85rem' }}>{trackingData.carrier}</strong></div>
                                  <div><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', textAlign: 'right' }}>Código Rastreio</span><strong style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--accent)' }}>{trackingData.trackingCode}</strong></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                                  <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '6px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 }} />
                                  {trackingData.events.map((ev, eIdx) => (
                                    <div key={eIdx} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
                                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: eIdx === 0 ? 'var(--accent)' : 'var(--bg-secondary)', border: `2px solid ${eIdx === 0 ? 'var(--accent)' : 'var(--border-color)'}`, marginTop: '3px', flexShrink: 0 }} />
                                      <div style={{ flexGrow: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><strong style={{ fontSize: '0.85rem', color: eIdx === 0 ? 'var(--accent)' : 'var(--text-primary)' }}>{ev.status}</strong><span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{ev.date}</span></div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>📍 {ev.location}</span>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{ev.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (<p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>Indisponível.</p>)}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto' }}>
                        {latestOrder.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)', flexShrink: 0 }}>
                            <img src={it.imageUrl} alt="" style={{ width: '28px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div><div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{it.productName}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tam: {it.size} | Qtd: {it.quantity}</div></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            <div style={{ backgroundColor: 'rgba(229, 203, 179, 0.05)', borderRadius: '12px', border: '1px dashed var(--accent)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}><Flame size={18} /> Desafio Semanal Flowfit</div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>Semana do Treino Constante</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>Complete seu terceiro check-in de treino na semana ou compre um Top para destravar **+150 Pontos Extras** e frete grátis.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Progresso: 2 de 3 treinos</span><span style={{ padding: '0.3rem 0.8rem', backgroundColor: 'var(--accent)', color: 'var(--bg-primary)', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem' }}>66% Concluído</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}><Sparkles size={16} style={{ color: 'var(--accent)' }} /><h4 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Looks Desejados para Você</h4></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendedProducts.map((prod) => (
                <Link key={prod.id} href={`/product/${prod.slug}`} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', textDecoration: 'none' }} className="product-card-simple">
                  <img src={prod.imageUrl} alt="" style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><span style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block' }}>{prod.name}</span><strong style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>{formatPrice(Number(prod.price))}</strong></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: PEDIDOS */}
      {activeTab === 'pedidos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 style={{ fontSize: '1.3rem' }}>Histórico Logístico Completo</h3><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mostrando {user.orders.length} remessa(s)</span></div>
          {user.orders.map((order) => {
            const statusInfo = statusMap[order.status] || statusMap.PENDING;
            return (
              <div key={order.id} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.8rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Rastreio</span><strong style={{ fontFamily: 'monospace' }}>#{order.id.slice(0,8).toUpperCase()}</strong></div>
                  <div><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Data Emissão</span><strong>{formatDate(order.createdAt)}</strong></div>
                  <div><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Total</span><strong style={{ color: 'var(--accent)' }}>{formatPrice(Number(order.totalAmount))}</strong></div>
                  <div><span style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', backgroundColor: statusInfo.bg, color: statusInfo.color, fontWeight: 'bold', fontSize: '0.8rem' }}>{statusInfo.label}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ABA 3: VIP */}
      {activeTab === 'vip' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}><h4 style={{ fontSize: '1.1rem', color: '#22c55e' }}>Cupom FLOWVIP10 Ativo</h4></div>
        </div>
      )}

      {/* 🌟 ABA 4: DADOS DA CONTA COM SUPORTE COMPLETO A EDIÇÃO (ENDEREÇO E WHATSAPP) */}
      {activeTab === 'dados' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                {isEditingProfile ? '✏️ Editando Endereço de Entrega VIP' : 'Informações e Endereço Residencial'}
              </h3>
              
              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  style={{
                    padding: '0.4rem 1rem', backgroundColor: 'var(--accent)', color: 'var(--bg-primary)',
                    border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem',
                    display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'
                  }}
                >
                  <Edit3 size={14} /> Editar Meus Dados
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem'
                  }}
                >
                  <X size={16} /> Cancelar Edição
                </button>
              )}
            </div>

            {profileSuccessMessage && (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '8px', color: '#22c55e', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {profileSuccessMessage}
              </div>
            )}

            {profileErrorMessage && (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {profileErrorMessage}
              </div>
            )}

            {/* MOTOR DE VISUALIZAÇÃO OU FORMULÁRIO DE EDIÇÃO CONTÍNUO */}
            {!isEditingProfile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Campos Blindados do Login */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Nome Completo</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user.name}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>E-mail de Autenticação</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{user.email}</strong>
                  </div>
                </div>

                {/* Linha de Contato e CEP */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Telefone WhatsApp VIP</span>
                    <strong style={{ fontSize: '0.95rem', color: formData.phone ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {formData.phone || 'Não cadastrado. Clique em Editar para incluir.'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>CEP de Coleta</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{formData.addressZip || '00000-000'}</strong>
                  </div>
                </div>

                {/* Endereço de Entrega Residencial */}
                <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Endereço de Destino de Remessas</span>
                  {formData.addressStreet ? (
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      <strong>{formData.addressStreet}</strong>, nº {formData.addressNumber} <br/>
                      {formData.addressComplement && <span>Comp: {formData.addressComplement} <br/></span>}
                      Bairro: {formData.addressNeighborhood} — {formData.addressCity} / {formData.addressState}
                    </div>
                  ) : (
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>Endereço de postagem pendente. Edite seu cadastro para habilitar frete expresso automatizado.</p>
                  )}
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={20} style={{ color: '#22c55e', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Conformidade LGPD Premium</strong>
                    Seus dados pessoais trafegam com criptografia TLS de Borda para postagem e despachos.
                  </div>
                </div>

              </div>
            ) : (
              // FORMULÁRIO DE ATUALIZAÇÃO CLIENT-SIDE (CRO DE AUTOATENDIMENTO)
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                
                {/* Linha 1: Telefone e CEP */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Celular / WhatsApp *</label>
                    <input 
                      type="text" 
                      name="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999" 
                      style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>CEP Residencial *</label>
                    <input 
                      type="text" 
                      name="addressZip" 
                      required 
                      value={formData.addressZip} 
                      onChange={handleInputChange}
                      placeholder="01310-100" 
                      style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
                    />
                  </div>
                </div>

                {/* Linha 2: Rua e Número */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Logradouro (Rua/Av) *</label>
                    <input 
                      type="text" 
                      name="addressStreet" 
                      required 
                      value={formData.addressStreet} 
                      onChange={handleInputChange}
                      placeholder="Avenida Paulista" 
                      style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Número *</label>
                    <input 
                      type="text" 
                      name="addressNumber" 
                      required 
                      value={formData.addressNumber} 
                      onChange={handleInputChange}
                      placeholder="1000" 
                      style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
                    />
                  </div>
                </div>

                {/* Linha 3: Complemento e Bairro */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Complemento (Apto, Bloco)</label>
                    <input 
                      type="text" 
                      name="addressComplement" 
                      value={formData.addressComplement} 
                      onChange={handleInputChange}
                      placeholder="Apto 42 - Torre B" 
                      style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Bairro *</label>
                    <input 
                      type="text" 
                      name="addressNeighborhood" 
                      required 
                      value={formData.addressNeighborhood} 
                      onChange={handleInputChange}
                      placeholder="Bela Vista" 
                      style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
                    />
                  </div>
                </div>

                {/* Linha 4: Cidade e Estado */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Cidade *</label>
                    <input 
                      type="text" 
                      name="addressCity" 
                      required 
                      value={formData.addressCity} 
                      onChange={handleInputChange}
                      placeholder="São Paulo" 
                      style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Estado (UF) *</label>
                    <input 
                      type="text" 
                      name="addressState" 
                      required 
                      value={formData.addressState} 
                      onChange={handleInputChange}
                      placeholder="SP" 
                      maxLength={2}
                      style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem', textTransform: 'uppercase' }} 
                    />
                  </div>
                </div>

                {/* Ações do Formulário */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    style={{ padding: '0.75rem 2rem', backgroundColor: '#22c55e', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  >
                    <Save size={16} /> {savingProfile ? 'Sincronizando Nuvem...' : 'Salvar Endereço e Contato VIP'}
                  </button>
                </div>

              </form>
            )}

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <form action="/api/logout" method="POST">
              <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LogOut size={16} /> Encerrar Sessão Segura
              </button>
            </form>

            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
              ID de Rastreio Anonimizado: <br/>
              <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{user.id.slice(0,12)}...</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
