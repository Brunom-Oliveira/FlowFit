"use client";

import { useState } from 'react';
import { Sparkles, MapPin, Calendar, Phone, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { completeProfile } from '../actions/auth';
import { useRouter } from 'next/navigation';

export default function CompleteProfileForm({ userName }: { userName: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const result = await completeProfile(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setSuccess(true);
      setTimeout(() => {
        router.refresh(); // Recarrega a página de servidor para atualizar a visualização e ocultar o banner
      }, 1200);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', animation: 'fadeIn 0.5s ease' }}>
        <CheckCircle2 size={32} style={{ color: '#4ade80', flexShrink: 0 }} />
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#4ade80', marginBottom: '0.25rem' }}>Perfil Concluído com Sucesso!</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Os metadados logísticos foram anexados à sua credencial VIP. A página será recarregada.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent)', borderRadius: '16px', marginBottom: '3rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      {/* Elemento de Destaque Visual */}
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', backgroundColor: 'var(--accent)', color: 'var(--bg-primary)', fontSize: '0.75rem', fontWeight: 'bold', borderBottomLeftRadius: '12px' }}>
        ONBOARDING LOGÍSTICO VIP
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Sparkles size={22} style={{ color: 'var(--accent)' }} />
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>Bem-vinda de volta, {userName.split(' ')[0]}!</h2>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '700px' }}>
        Para garantirmos entregas ultrarrápidas, envio de mimos surpresa de aniversário e atendimento prioritário na nossa expedição, complete seu endereço logístico seguro abaixo:
      </p>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Bloco 1: Contato e Nascimento */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 'bold' }}>
              <Phone size={14} style={{ color: 'var(--accent)' }} /> TELEFONE / WHATSAPP
            </label>
            <input 
              type="tel" 
              name="phone" 
              placeholder="(11) 99999-9999" 
              required
              minLength={10}
              maxLength={20}
              style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 'bold' }}>
              <Calendar size={14} style={{ color: 'var(--accent)' }} /> DATA DE NASCIMENTO
            </label>
            <input 
              type="date" 
              name="birthDate" 
              required
              max="2010-01-01" // Idade mínima sugerida de 16 anos
              min="1920-01-01"
              style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', colorScheme: 'dark' }}
            />
          </div>
        </div>

        {/* Bloco 2: Endereço Logístico */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '1rem', fontWeight: 'bold' }}>
            <MapPin size={14} /> DADOS DE ENTREGA SEGURA
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>LOGRADOURO (RUA/AVENIDA)</label>
              <input type="text" name="addressStreet" placeholder="Ex: Av. Paulista" required style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>NÚMERO</label>
              <input type="text" name="addressNumber" placeholder="1000" required style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>COMPLEMENTO (OPCIONAL)</label>
              <input type="text" name="addressComplement" placeholder="Apto 42, Bloco B" style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>BAIRRO</label>
              <input type="text" name="addressNeighborhood" placeholder="Bela Vista" required style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>CIDADE</label>
              <input type="text" name="addressCity" placeholder="São Paulo" required style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>ESTADO (UF)</label>
              <input type="text" name="addressState" placeholder="SP" required maxLength={2} minLength={2} style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', textTransform: 'uppercase' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>CEP</label>
              <input type="text" name="addressZip" placeholder="01310-100" required style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }} />
            </div>
          </div>

        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
          style={{ 
            alignSelf: 'flex-start', 
            padding: '0.8rem 2.5rem', 
            marginTop: '0.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Consolidando Credencial...</span>
            </>
          ) : (
            <span>Concluir Cadastro Logístico VIP</span>
          )}
        </button>

      </form>
    </div>
  );
}
