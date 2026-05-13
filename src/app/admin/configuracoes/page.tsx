"use client";

import { useState, useEffect } from 'react';
import { Save, Shield, Percent, Truck, Bell, RefreshCw, Key, MessageCircle, Share2, CheckCircle2 } from 'lucide-react';
import { updateStoreConfigAction, getStoreWhatsAppAction, getStoreSocialLinksAction } from '../../actions/store-config';

// Componentes SVG Oficiais Nativos
const InstagramIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TiktokIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

// 🚀 CONSULTORIA ENTERPRISE: PAINEL GLOBAL DE CONFIGURAÇÕES E ENGAGEMENT
// Adição do módulo autônomo de gestão de Redes Sociais conectado ao cache de Borda.
export default function SettingsPage() {
  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Canais VIP
  const [whatsappNumber, setWhatsappNumber] = useState<string>('5511999999999');
  
  // 🌟 LINKS DINÂMICOS DE REDES SOCIAIS (CRO SOCIAL)
  const [instagramUrl, setInstagramUrl] = useState<string>('https://instagram.com/flowfit.premium');
  const [facebookUrl, setFacebookUrl] = useState<string>('https://facebook.com/flowfit.premium');
  const [tiktokUrl, setTiktokUrl] = useState<string>('https://tiktok.com/@flowfit.premium');

  // Estados adicionais
  const [loyaltyRatio, setLoyaltyRatio] = useState<string>('10');
  const [loyaltyReward, setLoyaltyReward] = useState<string>('15');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<string>('299');
  const [whatsappNotifications, setWhatsappNotifications] = useState<boolean>(true);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [gatewayKey, setGatewayKey] = useState<string>('');

  // Busca e sincronização com a Vercel Edge na montagem
  useEffect(() => {
    async function loadActiveParameters() {
      try {
        const currentWpp = await getStoreWhatsAppAction();
        if (currentWpp) setWhatsappNumber(currentWpp);

        const currentSocial = await getStoreSocialLinksAction();
        if (currentSocial) {
          if (currentSocial.instagram) setInstagramUrl(currentSocial.instagram);
          if (currentSocial.facebook) setFacebookUrl(currentSocial.facebook);
          if (currentSocial.tiktok) setTiktokUrl(currentSocial.tiktok);
        }
      } catch (err) {
        console.warn('Erro isolado ao buscar telemetria de configurações.', err);
      }
    }
    loadActiveParameters();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateStoreConfigAction({
        whatsappNumber,
        instagramUrl,
        facebookUrl,
        tiktokUrl,
        loyaltyRatio,
        loyaltyReward,
        freeShippingThreshold
      });

      if (res.success) {
        setSuccessMsg('✓ Parâmetros de atendimento, regras de frete e links sociais propagados com sucesso.');
        if (res.whatsapp) setWhatsappNumber(res.whatsapp);
        if (res.social) {
          setInstagramUrl(res.social.instagram);
          setFacebookUrl(res.social.facebook);
          setTiktokUrl(res.social.tiktok);
        }
      } else {
        setErrorMsg(res.error || 'Erro de nível de privilégio ao submeter chaves globais.');
      }
    } catch (err) {
      setErrorMsg('Falha ao comunicar alterações para a Borda Vercel Edge.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '3rem', maxWidth: '1300px', margin: '0 auto', color: 'var(--text-primary)', contentVisibility: 'auto' }}>
      
      {/* Header Corporativo */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>
            <Shield size={14} /> Gestão Executiva Centralizada
          </div>
          <h1 style={{ fontSize: '2.2rem', margin: 0, fontFamily: 'var(--font-display)' }}>
            Configurações Globais e Redes
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Altere canais de suporte no WhatsApp, links de engajamento social e gatilhos logísticos.
          </p>
        </div>

        <button 
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{ 
            padding: '0.75rem 2rem', backgroundColor: '#22c55e', color: '#fff', border: 'none', 
            borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', cursor: saving ? 'wait' : 'pointer', 
            display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' 
          }}
        >
          {saving ? <RefreshCw className="spin" size={16} /> : <Save size={16} />}
          {saving ? 'Atualizando Loja...' : 'Salvar e Propagar Modificações'}
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeIn 0.3s ease' }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeIn 0.3s ease' }}>
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Aviso Crítico:</span> {errorMsg}
        </div>
      )}

      {/* Grid de Formulários */}
      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        
        {/* CARTÃO 1: ATENDIMENTO WHATSAPP */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#22c55e' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', color: '#22c55e' }}>
              <MessageCircle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)', fontWeight: 'bold' }}>Suporte WhatsApp VIP</h2>
              <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 'bold' }}>Atendimento em tempo real</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
            Número de telefone oficial associado ao botão de suporte flutuante do storefront.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 'bold' }}>
              Celular com DDD e País *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                wa.me/
              </span>
              <input 
                type="text" 
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="5511999999999" 
                style={{ flex: 1, padding: '0.8rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 'bold' }}
              />
            </div>
          </div>
        </div>

        {/* 🌟 CARTÃO EM DESTAQUE: REDES SOCIAIS DA MARCA (NOVO) */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2.2rem', borderRadius: '12px', border: '2px solid rgba(168, 85, 247, 0.4)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#a855f7' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px', color: '#a855f7' }}>
              <Share2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)', fontWeight: 'bold' }}>Canais e Redes Sociais</h2>
              <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 'bold' }}>Ícones dinâmicos no Rodapé da Loja</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
            Preencha os caminhos completos para os perfis sociais da marca. Os links são injetados automaticamente no *Footer* para potencializar o tráfego orgânico.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* Instagram */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 'bold' }}>
                <InstagramIcon size={14} color="#ec4899" /> Link do Instagram Oficial
              </label>
              <input 
                type="url" 
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/flowfit.premium"
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem' }}
              />
            </div>

            {/* Facebook */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 'bold' }}>
                <FacebookIcon size={14} color="#3b82f6" /> Link do Facebook Oficial
              </label>
              <input 
                type="url" 
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/flowfit.premium"
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem' }}
              />
            </div>

            {/* TikTok */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 'bold' }}>
                <TiktokIcon size={14} color="var(--text-primary)" /> Link do TikTok da Marca
              </label>
              <input 
                type="url" 
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://tiktok.com/@flowfit.premium"
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem' }}
              />
            </div>

          </div>
        </div>

        {/* CARTÃO 3: REGRAS LOGÍSTICAS E FRETE */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2.2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            <Truck size={22} />
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 'bold', color: 'var(--text-primary)' }}>Gatilhos Logísticos</h2>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Teto para Isenção de Frete (R$)
            </label>
            <input 
              type="number" 
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 'bold' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'block' }}>
              Pedidos transacionados acima da margem configurada recebem envio expresso grátis.
            </span>
          </div>
        </div>

        {/* CARTÃO 4: MOTOR FLOWVIP */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2.2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            <Percent size={22} />
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 'bold', color: 'var(--text-primary)' }}>Clube FLOWVIP</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Relação de Pontuação (R$ por 1 Ponto)
              </label>
              <input 
                type="number" 
                value={loyaltyRatio}
                onChange={(e) => setLoyaltyRatio(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 'bold' }}
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
