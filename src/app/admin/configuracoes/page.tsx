"use client";

import { useState } from 'react';
import { Save, Shield, Percent, Truck, Bell, RefreshCw, Key } from 'lucide-react';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Estados dos formulários de configuração
  const [loyaltyRatio, setLoyaltyRatio] = useState('10'); // R$ 10 = 1 ponto
  const [loyaltyReward, setLoyaltyReward] = useState('15'); // R$ 15 de desconto
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('299');
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [gatewayKey, setGatewayKey] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    // Simula salvamento em Edge Config ou Banco de Dados
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Configurações Enterprise atualizadas com sucesso em todas as instâncias da borda (Edge).');
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1200);
  };

  return (
    <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
            Configurações Globais do Sistema
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Gerencie os parâmetros do motor de recompensas FLOWVIP, gateways de pagamento e chaves de API.
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
        >
          {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Aplicando...' : 'Salvar Alterações'}
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={20} />
          <span style={{ fontWeight: 'bold' }}>{successMsg}</span>
        </div>
      )}

      {/* Grid de Cartões de Configuração */}
      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        
        {/* Cartão 1: Motor de Recompensas FLOWVIP */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            <Percent size={24} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Motor do Clube FLOWVIP</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Fator de Ganho de Pontos (R$ por 1 Ponto)
              </label>
              <input 
                type="number" 
                value={loyaltyRatio}
                onChange={(e) => setLoyaltyRatio(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
                Atualmente: A cada R$ 10,00 gastos, a cliente acumula 1 Ponto VIP.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Valor de Resgate Padrão (R$ Desconto por 150 Pontos)
              </label>
              <input 
                type="number" 
                value={loyaltyReward}
                onChange={(e) => setLoyaltyReward(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Cartão 2: Gateways de Pagamento */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            <Key size={24} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Integração de Pagamentos</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Chave Secreta Gateway (Stripe / Pagar.me)
              </label>
              <input 
                type="password" 
                value={gatewayKey}
                onChange={(e) => setGatewayKey(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.9rem' }}>Modo Sandbox (Testes)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Transações usam cartões simulados</span>
              </div>
              <input type="checkbox" defaultChecked={false} style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
            </div>
          </div>
        </div>

        {/* Cartão 3: Fretes e Logística */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            <Truck size={24} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Regras Logísticas</h2>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Gatilho de Frete Grátis (R$)
            </label>
            <input 
              type="number" 
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
              Pedidos acima deste valor ganham isenção automática no checkout transacional.
            </span>
          </div>
        </div>

        {/* Cartão 4: Notificações e Status */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            <Bell size={24} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Avisos e Sistema</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.9rem' }}>Notificações por WhatsApp</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Disparar código de rastreio e Pix gerado</span>
              </div>
              <input 
                type="checkbox" 
                checked={whatsappNotifications} 
                onChange={(e) => setWhatsappNotifications(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} 
              />
            </label>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem' }}></div>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.9rem', color: maintenanceMode ? '#ef4444' : 'inherit' }}>
                  Modo de Manutenção
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bloquear acessos de clientes ao storefront</span>
              </div>
              <input 
                type="checkbox" 
                checked={maintenanceMode} 
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} 
              />
            </label>
          </div>
        </div>

      </form>
    </div>
  );
}
