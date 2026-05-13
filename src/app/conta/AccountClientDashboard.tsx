"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Package, Award, User, LogOut, ArrowUpRight, CheckCircle2, Truck, ShoppingBag, Sparkles, Gift, Flame, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { fetchTrackingEvents, ShippingTrackingResponse } from '../../lib/enterprise/shipping';

interface AccountClientDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
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

// 🚀 CONSULTORIA ENTERPRISE: IMPLEMENTAÇÃO DA SPRINT 2 (Rastreio Real & Notificações)
// Evolução física do painel integrando a visualização de eventos detalhados de transportadora
// e sistema inteligente de avisos de engajamento proativo.
export function AccountClientDashboard({ user, recommendedProducts }: AccountClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pedidos' | 'vip' | 'dados'>('dashboard');
  
  // Estados de Rastreamento Detalhado da Transportadora (Sprint 2)
  const [loadingTracking, setLoadingTracking] = useState<boolean>(false);
  const [trackingData, setTrackingData] = useState<ShippingTrackingResponse | null>(null);
  const [showTrackingDetails, setShowTrackingDetails] = useState<boolean>(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
  };

  // Status mapping visual rico
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

  // 🌟 REGRAS DE NEGÓCIO DA GAMIFICAÇÃO VIP FLOWFIT
  const totalSpent = user.orders.reduce((acc, o) => acc + Number(o.totalAmount), 0);
  const loyaltyPoints = Math.floor(totalSpent / 10);
  const cashbackAvailable = totalSpent * 0.05; // 5% de Cashback real

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

  // 🚀 AÇÃO DA SPRINT 2: Carregamento do Rastreamento Externo Detalhado
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

  // Identificação do Pedido Ativo
  const latestOrder = user.orders[0];

  return (
    <div className="account-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', contentVisibility: 'auto' }}>
      
      {/* 🌟 BANNER DINÂMICO DE NOTIFICAÇÕES INTELIGENTES (SPRINT 2 / RETENÇÃO ATIVA) */}
      {latestOrder && latestOrder.status !== 'CANCELED' && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', animation: 'fadeIn 0.5s ease' }}>
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
            style={{ padding: '0.3rem 0.8rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s ease' }}
          >
            Acompanhar Rota
          </button>
        </div>
      )}

      {/* BANNER SUPERIOR DE GAMIFICAÇÃO & RETENÇÃO VIP */}
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

        {/* Barra de Progresso VIP Animada */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Progresso para o nível <strong style={{ color: 'var(--accent)' }}>{nextTierName}</strong>:
            </span>
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {vipTier === 'Black Diamond' ? '✓ Desbloqueio Máximo' : `${Math.floor(tierProgress)}%`}
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${tierProgress}%`, backgroundColor: 'var(--accent)', borderRadius: '10px', transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          </div>

          {vipTier !== 'Black Diamond' && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Faltam apenas <strong>{formatPrice(nextTierThreshold - totalSpent)}</strong> em compras para desbloquear <strong>Frete Expresso Gratuito Vitalício</strong>.
            </p>
          )}
        </div>
      </div>

      {/* NAVEGAÇÃO HORIZONTAL DE ALTA ESCANEABILIDADE */}
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

      {/* ABA 1: VISÃO GERAL COM RASTREAMENTO DETALHADO (SPRINT 2) */}
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

                      {/* Timeline Básica */}
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
                                <span style={{ fontSize: '0.65rem', color: idx === statusInfo.stepIndex ? 'var(--accent)' : 'var(--text-secondary)', marginTop: '0.4rem', textAlign: 'center' }}>
                                  {st.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 🌟 BOTÃO EXPANSÍVEL DA SPRINT 2: RASTREAMENTO REAL DA TRANSPORTADORA */}
                      <div style={{ marginBottom: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.2rem' }}>
                        <button
                          type="button"
                          onClick={() => handleLoadTracking(latestOrder.id)}
                          style={{
                            width: '100%', padding: '0.75rem', borderRadius: '8px',
                            backgroundColor: 'rgba(229, 203, 179, 0.05)',
                            border: '1px solid rgba(229, 203, 179, 0.2)',
                            color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            cursor: 'pointer', transition: 'all 0.2s ease'
                          }}
                        >
                          <Package size={16} /> 
                          {showTrackingDetails ? 'Ocultar Detalhes de Transporte' : 'Acompanhar Eventos da Transportadora em Tempo Real'}
                          {showTrackingDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {/* Motor de exibição do Rastreamento Externo */}
                        {showTrackingDetails && (
                          <div style={{ marginTop: '1rem', padding: '1.2rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', animation: 'fadeIn 0.3s ease' }}>
                            {loadingTracking ? (
                              <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                                Conectando com os satélites da transportadora...
                              </div>
                            ) : trackingData ? (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                                  <div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Empresa Logística</span>
                                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{trackingData.carrier}</strong>
                                  </div>
                                  <div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', textAlign: 'right' }}>Código Rastreio</span>
                                    <strong style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--accent)' }}>{trackingData.trackingCode}</strong>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                                  {/* Linha guia vertical */}
                                  <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '6px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 }} />

                                  {trackingData.events.map((ev, eIdx) => (
                                    <div key={eIdx} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
                                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: eIdx === 0 ? 'var(--accent)' : 'var(--bg-secondary)', border: `2px solid ${eIdx === 0 ? 'var(--accent)' : 'var(--border-color)'}`, marginTop: '3px', flexShrink: 0 }} />
                                      <div style={{ flexGrow: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                          <strong style={{ fontSize: '0.85rem', color: eIdx === 0 ? 'var(--accent)' : 'var(--text-primary)' }}>{ev.status}</strong>
                                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{ev.date}</span>
                                        </div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>📍 {ev.location}</span>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{ev.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>Transportadora temporariamente indisponível.</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Miniaturas de Peças */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto' }}>
                        {latestOrder.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)', flexShrink: 0 }}>
                            <img src={it.imageUrl} alt="" style={{ width: '28px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{it.productName}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tam: {it.size} | Qtd: {it.quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })()
              )}
            </div>

            {/* DESAFIOS FIT GAMIFICADOS */}
            <div style={{ backgroundColor: 'rgba(229, 203, 179, 0.05)', borderRadius: '12px', border: '1px dashed var(--accent)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                <Flame size={18} /> Desafio Semanal Flowfit
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                Semana do Treino Constante
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: '1.4' }}>
                Complete seu terceiro check-in de treino na semana ou compre um Top para destravar **+150 Pontos Extras** e frete grátis surpresa.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Progresso: 2 de 3 treinos</span>
                <span style={{ padding: '0.3rem 0.8rem', backgroundColor: 'var(--accent)', color: 'var(--bg-primary)', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  66% Concluído
                </span>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <Sparkles size={16} style={{ color: 'var(--accent)' }} />
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Looks Desejados para Você</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendedProducts.map((prod) => (
                <Link key={prod.id} href={`/product/${prod.slug}`} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', textDecoration: 'none', transition: 'transform 0.2s ease' }} className="product-card-simple">
                  <img src={prod.imageUrl} alt="" style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '4px', backgroundColor: 'var(--bg-primary)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>{prod.name}</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--accent)', display: 'block' }}>{formatPrice(Number(prod.price))}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#22c55e', marginTop: '0.2rem' }}>Em estoque VIP</span>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center', marginTop: '0.5rem' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Dúvidas sobre o tamanho?</span>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none' }}>
                Personal Shopper WhatsApp <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

        </div>
      )}

      {/* ABA 2: HISTÓRICO COMPLETO DE PEDIDOS */}
      {activeTab === 'pedidos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Histórico Logístico Completo</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mostrando {user.orders.length} remessa(s)</span>
          </div>

          {user.orders.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Nenhum pedido efetuado no sistema.</p>
            </div>
          ) : (
            user.orders.map((order) => {
              const statusInfo = statusMap[order.status] || statusMap.PENDING;

              return (
                <div key={order.id} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.8rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Código Rastreio</span>
                      <strong style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: 'var(--text-primary)' }}>#{order.id.slice(0,8).toUpperCase()}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Data Emissão</span>
                      <strong>{formatDate(order.createdAt)}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Total</span>
                      <strong style={{ color: 'var(--accent)' }}>{formatPrice(Number(order.totalAmount))}</strong>
                    </div>
                    <div>
                      <span style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', backgroundColor: statusInfo.bg, color: statusInfo.color, fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', backgroundColor: 'var(--bg-primary)', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={it.imageUrl} alt="" style={{ width: '35px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>{it.productName}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tamanho: <strong style={{ color: 'var(--accent)' }}>{it.size}</strong> | Qtd: {it.quantity}</span>
                          </div>
                        </div>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {formatPrice(it.price * it.quantity)}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ABA 3: BENEFÍCIOS VIP */}
      {activeTab === 'vip' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', marginBottom: '1rem', fontWeight: 'bold' }}>
              <Gift size={18} /> Cupom Exclusivo FLOWVIP
            </div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>10% OFF em Lançamentos</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Ativado automaticamente por você pertencer ao patamar de lealdade ativo.</p>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', border: '1px dashed #22c55e', textAlign: 'center', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e', letterSpacing: '2px' }}>
              FLOWVIP10
            </div>
            <span style={{ display: 'block', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Válido para todo o site</span>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '1rem', fontWeight: 'bold' }}>
              <Award size={18} /> Frete Expresso e Troca Grátis
            </div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Garantia Logística Flowfit</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>A sua numeração não serviu perfeitamente? A primeira coleta e reenvio são por nossa conta.</p>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              ✓ Coleta VIP agendada via WhatsApp
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: DADOS DA CONTA */}
      {activeTab === 'dados' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Informações Cadastrais Blindadas
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Nome Completo</span>
                <input type="text" readOnly value={user.name} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>E-mail de Acesso (Login JWT)</span>
                <input type="text" readOnly value={user.email} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }} />
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={20} style={{ color: '#22c55e', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Conformidade LGPD Premium</strong>
                Os seus dados sensíveis trafegam estritamente criptografados via protocolo TLS na Vercel Edge.
              </div>
            </div>
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
