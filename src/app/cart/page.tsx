"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="container section cart-empty">
        <h2>Sua sacola está vazia</h2>
        <p>Parece que você ainda não adicionou nenhum produto.</p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="container section cart-page">
      <h2 className="section-title" style={{ marginBottom: '2rem' }}>SUA SACOLA</h2>
      
      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.product.id} className="cart-item">
              <div style={{ position: 'relative', width: '80px', height: '100px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                <Image src={item.product.image} alt={item.product.name} fill sizes="80px" style={{ objectFit: 'cover' }} />
              </div>
              
              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <span className="cart-item-category">{item.product.category}</span>
                <span className="cart-item-price">{item.product.priceFormatted}</span>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Resumo do Pedido</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Frete</span>
            <span>Grátis</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          
          <Link href="/checkout" className="btn btn-primary full-width" style={{ marginTop: '2rem' }}>
            Finalizar Compra <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
