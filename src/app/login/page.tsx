"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { login } from '../actions/auth';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    if (!isLogin) {
      setError("O módulo de cadastro VIP estará disponível no próximo ciclo de atualizações. Por favor, utilize as credenciais de teste na aba de Login.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Server Action
    const result: any = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      if (result.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/conta');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        {/* Left Side - Image */}
        <div className="login-image" style={{ position: 'relative' }}>
          <div className="login-image-overlay" style={{ zIndex: 10 }}>
            <h2 className="login-quote">VISTA SUA FORÇA.</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.2rem', maxWidth: '400px', lineHeight: '1.6' }}>
              Acesse sua conta para uma experiência de compra personalizada, rastreamento de pedidos e acesso antecipado a novos lançamentos.
            </p>
          </div>
          <Image 
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80" 
            alt="Treino Flowfit" 
            fill
            sizes="50vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Right Side - Form */}
        <div className="login-form-container">
          <div className="login-form-content">
            <h1 className="login-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {isLogin ? 'Bem-vinda de volta' : 'Crie sua conta'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {isLogin ? 'Faça login para acessar seus pedidos e benefícios.' : 'Junte-se à Flowfit e eleve seus treinos.'}
            </p>

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeIn 0.2s ease' }}>
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{error}</span>
              </div>
            )}

            <form action={handleSubmit} className="checkout-form">
              {!isLogin && (
                <div className="form-group">
                  <input type="text" name="name" placeholder="Nome completo" required />
                </div>
              )}
              
              <div className="form-group">
                <input type="email" name="email" placeholder="E-mail (ex: amanda@test.com ou admin@flowfit.com)" required />
              </div>
              
              <div className="form-group">
                <input type="password" name="password" placeholder="Senha (ex: 123 ou admin123)" required />
              </div>

              {isLogin && (
                <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                  <a href="#" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>Esqueceu a senha?</a>
                </div>
              )}

              <button type="submit" className="btn btn-primary full-width" style={{ marginTop: isLogin ? '0' : '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
                {loading ? 'Autenticando...' : (isLogin ? 'Entrar na Conta' : 'Criar Conta')} 
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="login-toggle">
              <span style={{ color: 'var(--text-secondary)' }}>
                {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}
              </span>
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }} 
                className="toggle-btn" 
                type="button"
              >
                {isLogin ? 'Cadastre-se' : 'Faça Login'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
