"use client";

import { useState } from 'react';
import { Send, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

export function ContatoForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          orderId: data.get('orderId'),
          message: data.get('message'),
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Falha ao enviar');
      setSent(true);
    } catch {
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section" style={{ paddingTop: '120px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Atendimento Exclusivo
        </span>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', marginTop: '0.5rem', marginBottom: '1rem' }}>
          Fale com a Flowfit
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Estamos prontas para te ajudar a escolher o tamanho ideal ou rastrear seu pedido.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
            Canais Diretos
          </h3>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', color: 'var(--accent)' }}>
              <Phone size={20} />
            </div>
            <div>
              <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>WhatsApp VIP</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>(11) 99888-FLOW</span>
              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginTop: '0.2rem' }}>Disponível Agora</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', color: 'var(--accent)' }}>
              <Mail size={20} />
            </div>
            <div>
              <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>E-mail</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>sac@flowfit.com</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', color: 'var(--accent)' }}>
              <MapPin size={20} />
            </div>
            <div>
              <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>Sede Administrativa</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Av. Brigadeiro Faria Lima, 3000<br />São Paulo - SP</span>
            </div>
          </div>
        </div>

        <div>
          {sent ? (
            <div style={{ padding: '3rem 2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--accent)', textAlign: 'center' }}>
              <CheckCircle2 size={48} style={{ color: '#10b981', margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Mensagem Enviada!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Uma especialista do nosso time já recebeu sua dúvida e entrará em contato em breve.
              </p>
              <button onClick={() => setSent(false)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Enviar Nova Mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Seu Nome</label>
                <input required type="text" name="name" placeholder="Como prefere ser chamada?" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>E-mail para Retorno</label>
                <input required type="email" name="email" placeholder="seu.email@exemplo.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Número do Pedido (Opcional)</label>
                <input type="text" name="orderId" placeholder="Ex: #1042" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Sua Mensagem</label>
                <textarea required rows={4} name="message" placeholder="Descreva como podemos te ajudar..." style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
              </div>

              <button disabled={loading} type="submit" className="btn btn-primary full-width" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Send size={18} /> {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
