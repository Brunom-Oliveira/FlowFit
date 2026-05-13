"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { login, register } from '../actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Realtime password check
  const [passwordInput, setPasswordInput] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/conta';

  // Validação visual de senha forte em tempo real (Fase 8 - UX Authentication)
  const hasMinLength = passwordInput.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordInput);
  const hasLower = /[a-z]/.test(passwordInput);
  const hasNumber = /[0-9]/.test(passwordInput);
  const hasSpecial = /[@$!%*?&]/.test(passwordInput);
  const isPasswordStrong = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        const result = await login(formData);
        if (result?.error) {
          setError(result.error);
          setLoading(false);
        } else if (result?.success) {
          setSuccessMsg(`Bem-vinda de volta, ${result.name?.split(' ')[0] || 'VIP'}! Redirecionando...`);
          // Redireciona com base no perfil de segurança
          setTimeout(() => {
            if (result.role === 'ADMIN') {
              router.push('/admin');
            } else {
              router.push(callbackUrl);
            }
          }, 600);
        }
      } else {
        // Fluxo de Cadastro VIP Seguro
        const acceptTerms = formData.get('acceptTerms');
        if (!acceptTerms) {
          setError('O consentimento com as Políticas de Privacidade e Proteção de Dados (LGPD) é obrigatório.');
          setLoading(false);
          return;
        }

        if (!isPasswordStrong) {
          setError('A senha escolhida não atende a todos os critérios corporativos de segurança.');
          setLoading(false);
          return;
        }

        // Injeta a flag booleana de aceitação
        formData.set('acceptTerms', 'true');
        
        const result = await register(formData);
        if (result?.error) {
          setError(result.error);
          setLoading(false);
        } else if (result?.success) {
          setSuccessMsg(`Conta criada com sucesso! Seja bem-vinda ao universo premium, ${result.name?.split(' ')[0]}!`);
          setTimeout(() => {
            router.push('/conta');
          }, 800);
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado de rede. Verifique sua conexão.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="login-container" style={{ width: '100%', maxWidth: '1150px', minHeight: '680px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', boxShadow: '0 25px 60px rgba(0,0,0,0.7)' }}>
        
        {/* Lado Esquerdo - Cover Visual Inspirador (Oculto no Mobile) */}
        <div className="login-image" style={{ position: 'relative', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div className="login-image-overlay" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '4rem', zIndex: 10, background: 'linear-gradient(0deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0) 100%)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(229, 203, 179, 0.15)', padding: '0.4rem 1rem', borderRadius: '20px', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
              <ShieldCheck size={14} /> AUTENTICAÇÃO SEGURA CORPORATIVA
            </div>
            <h2 style={{ fontSize: '2.8rem', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: '1.05', letterSpacing: '-0.02em' }}>
              VISTA SUA <span style={{ color: 'var(--accent)' }}>FORÇA.</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '420px', lineHeight: '1.6' }}>
              Acesso protegido por criptografia ponta-a-ponta, rastreamento de entregas de alto padrão e atendimento exclusivo sob medida.
            </p>
          </div>
          <Image 
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80" 
            alt="Treino Flowfit Premium" 
            fill
            sizes="(max-width: 768px) 0vw, 50vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Lado Direito - Formulários Ricos em UX e Segurança */}
        <div style={{ padding: '4rem 4.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            
            {/* Títulos Interativos */}
            <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
              {isLogin ? 'Bem-vinda de volta' : 'Eleve seus Treinos'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
              {isLogin ? 'Acesse seu histórico de compras e suporte VIP.' : 'Crie sua credencial segura em menos de 1 minuto.'}
            </p>

            {/* Alertas de Feedback Elegantes */}
            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', animation: 'fadeIn 0.3s ease' }}>
                <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{error}</span>
              </div>
            )}

            {successMsg && (
              <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeIn 0.3s ease' }}>
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{successMsg}</span>
              </div>
            )}

            <form action={handleSubmit} className="checkout-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {!isLogin && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 'bold' }}>
                    NOME COMPLETO
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Ex: Amanda Albuquerque" 
                    required 
                    minLength={3}
                    maxLength={120}
                    style={{ width: '100%', padding: '0.9rem 1.2rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 'bold' }}>
                  ENDEREÇO DE E-MAIL
                </label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="amanda@exemplo.com ou admin@flowfit.com" 
                  required 
                  autoComplete="username"
                  style={{ width: '100%', padding: '0.9rem 1.2rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                    SENHA DE ACESSO
                  </label>
                  {isLogin && (
                    <Link href="#" style={{ color: 'var(--accent)', fontSize: '0.8rem', transition: 'text-decoration 0.2s ease' }} className="hover:underline">
                      Esqueceu a senha?
                    </Link>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password" 
                    placeholder={isLogin ? '••••••••' : 'Mínimo 8 caracteres com símbolos'} 
                    required 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    style={{ width: '100%', padding: '0.9rem 2.8rem 0.9rem 1.2rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', padding: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Microinteração: Indicadores Visuais de Força da Senha no Cadastro */}
                {!isLogin && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Critérios Corporativos de Senha:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.75rem' }}>
                      <span style={{ color: hasMinLength ? '#4ade80' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {hasMinLength ? '✓' : '○'} 8+ caracteres
                      </span>
                      <span style={{ color: hasUpper ? '#4ade80' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {hasUpper ? '✓' : '○'} Letra Maiúscula
                      </span>
                      <span style={{ color: hasLower ? '#4ade80' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {hasLower ? '✓' : '○'} Letra Minúscula
                      </span>
                      <span style={{ color: hasNumber ? '#4ade80' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {hasNumber ? '✓' : '○'} Número
                      </span>
                      <span style={{ color: hasSpecial ? '#4ade80' : 'var(--text-secondary)', gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {hasSpecial ? '✓' : '○'} Caractere especial (@$!%*?&)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Consentimento LGPD Dinâmico */}
              {!isLogin && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="acceptTerms" 
                    name="acceptTerms" 
                    value="true" 
                    defaultChecked
                    style={{ marginTop: '0.2rem', accentColor: 'var(--accent)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="acceptTerms" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', cursor: 'pointer' }}>
                    Autorizo o tratamento dos meus dados pessoais em conformidade com a <strong style={{ color: 'var(--text-primary)' }}>LGPD (Lei Geral de Proteção de Dados)</strong> para fins logísticos e ofertas customizadas.
                  </label>
                </div>
              )}

              {/* Botão de Submit com Loading State Adaptativo */}
              <button 
                type="submit" 
                className="btn btn-primary full-width" 
                disabled={loading || (!isLogin && !isPasswordStrong)}
                style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  opacity: loading || (!isLogin && !isPasswordStrong) ? 0.6 : 1,
                  cursor: loading || (!isLogin && !isPasswordStrong) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Autenticando Conexão...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Entrar na Plataforma' : 'Finalizar Cadastro VIP'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Alternância de Fluxo (Login / Registro) */}
            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {isLogin ? 'Ainda não faz parte do clube?' : 'Já possui uma credencial?'}
              </span>
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccessMsg(null);
                  setPasswordInput('');
                }}
                style={{ color: 'var(--accent)', fontWeight: 'bold', transition: 'color 0.2s ease' }}
                className="hover:underline"
              >
                {isLogin ? 'Cadastre-se Agora' : 'Faça Login VIP'}
              </button>
            </div>

            {/* Selo de Garantia e Confiança de Nível Enterprise */}
            <div style={{ marginTop: '3rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', opacity: 0.7 }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
              <span>Conexão protegida com TLS 1.3 & OWASP Security Standards</span>
            </div>

          </div>
        </div>

      </div>

      {/* Adiciona estilo global de spin via tag estilo local para o loader */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
