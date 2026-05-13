"use client";

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, CheckCircle2, ShoppingBag, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { processCheckout } from '../actions/checkout';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mapeia tamanhos selecionados para cada item no carrinho
  const [itemSizes, setItemSizes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    cart.forEach(item => {
      initial[item.product.id] = item.product.sizes?.[0] || 'M';
    });
    return initial;
  });

  // Estado de Resgate de Pontos de Fidelidade (Tarefa 8.2)
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const loyaltyDiscount = useLoyaltyPoints ? 15.00 : 0;
  const finalPayableTotal = Math.max(0, cartTotal - loyaltyDiscount);

  const handleSizeChange = (productId: string, size: string) => {
    setItemSizes(prev => ({ ...prev, [productId]: size }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const itemsPayload = cart.map(item => ({
      id: item.product.id,
      selectedSize: itemSizes[item.product.id] || 'M',
      quantity: item.quantity
    }));

    formData.set('items', JSON.stringify(itemsPayload));
    if (useLoyaltyPoints) {
      formData.set('discountValue', '15.00');
    }

    const res = await processCheckout(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      clearCart();
      router.push(`/checkout/sucesso?orderId=${res.orderId}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <ShoppingBag size={64} style={{ margin: '0 auto 1.5rem', color: 'var(--accent)', opacity: 0.5 }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Sua sacola está vazia</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          Adicione roupas exclusivas da nossa coleção fitness para prosseguir com a compra.
        </p>
        <Link href="/shop" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '8rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
          <ArrowLeft size={18} /> Voltar para Sacola
        </Link>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Finalizar Pedido</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Preencha os dados de entrega para garantir suas peças Flowfit.</p>
      </header>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
        
        {/* Lado Esquerdo - Formulário */}
        <form action={handleSubmit} onSubmit={() => setLoading(true)} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>1. Dados Pessoais</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nome Completo *</label>
                <input type="text" name="name" required placeholder="Amanda Silva" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>E-mail *</label>
                <input type="email" name="email" required placeholder="amanda@email.com" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>2. Endereço de Entrega</h2>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Endereço Completo (Rua, Número, Complemento, CEP e Cidade) *</label>
              <textarea name="address" rows={3} required placeholder="Av. Paulista, 1000 - Apto 42 - São Paulo/SP - 01310-100" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}></textarea>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>3. Pagamento Integrado</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Para este lançamento MVP, o sistema processará seu pedido de forma imediata.
            </p>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(229, 203, 179, 0.1)', border: '1px solid var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
              <CheckCircle2 size={20} />
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Checkout Expresso Aprovado</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width" style={{ padding: '1.2rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'Processando Pedido...' : 'Confirmar e Finalizar Compra'}
          </button>

        </form>

        {/* Lado Direito - Resumo dos Itens e Widget FLOWVIP */}
        <div style={{ alignSelf: 'start', backgroundColor: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Resumo do Pedido</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
            {cart.map(item => (
              <div key={item.product.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '60px', height: '75px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden' }}>
                  <Image src={item.product.image} alt={item.product.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{item.product.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qtd: {item.quantity}</div>
                  
                  {/* Seletor de Tamanho Inline Expresso */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Tamanho:</span>
                    <select 
                      value={itemSizes[item.product.id] || 'M'} 
                      onChange={(e) => handleSizeChange(item.product.id, e.target.value)}
                      style={{ padding: '0.1rem 0.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                    >
                      {['P', 'M', 'G', 'GG'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* 🌟 WIDGET DE RESGATE DE PONTOS FLOWVIP (TAREFA 8.2) */}
          <div style={{ marginBottom: '2rem', padding: '1.2rem', backgroundColor: 'rgba(229, 203, 179, 0.05)', borderRadius: '8px', border: '1px solid rgba(229, 203, 179, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                <Award size={16} /> Clube FLOWVIP
              </span>
              <span style={{ fontSize: '0.75rem', color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                Saldo: 150 pts Disponíveis
              </span>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', marginTop: '0.8rem' }}>
              <input 
                type="checkbox" 
                checked={useLoyaltyPoints}
                onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                style={{ marginTop: '0.2rem', accentColor: 'var(--accent)', width: '16px', height: '16px' }}
              />
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                  Resgatar 150 pontos VIP
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Aplica um bônus imediato de R$ 15,00 de desconto no seu pedido final.
                </span>
              </div>
            </label>
          </div>

          {/* Totais Finais */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal das Peças</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            
            {useLoyaltyPoints && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22c55e', fontWeight: 'bold', animation: 'fadeIn 0.3s ease' }}>
                <span>Desconto FLOWVIP</span>
                <span>- {formatPrice(loyaltyDiscount)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Frete Expresso</span>
              <span style={{ color: '#22c55e' }}>GRÁTIS</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              <span>Total a Pagar</span>
              <span style={{ color: 'var(--accent)' }}>{formatPrice(finalPayableTotal)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
