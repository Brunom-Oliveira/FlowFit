"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UIProduct as Product } from '../lib/products';
import { useCart } from '../context/CartContext';
import { Check, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Previne abertura da PDP ao clicar no botão rápido
    
    addToCart(product);
    setAdded(true);
    
    // Feedback tátil visual avançado (Microinteração / CRO)
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  // Simulação inteligente de Escassez/Urgência focada em conversão (Alo Yoga / Lululemon vibes)
  const isBestSeller = product.category === 'Leggings' || product.category === 'Tops';

  return (
    <Link 
      href={`/product/${product.id}`} 
      className="product-card group"
      aria-label={`Comprar ${product.name} na categoria ${product.category}`}
      style={{ display: 'block', outline: 'none', transition: 'transform 0.2s ease' }}
    >
      <div 
        className="product-img-wrapper" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '3/4', 
          borderRadius: '10px', 
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="product-img"
          style={{ 
            objectFit: 'cover', 
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}
        />

        {/* Badges Premium de Conversão */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 10 }}>
          {isBestSeller && (
            <span style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', padding: '0.25rem 0.6rem', borderRadius: '4px', letterSpacing: '1px' }}>
              Mais Desejado
            </span>
          )}
          <span style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            5% OFF Pix
          </span>
        </div>

        {/* Ação Rápida Otimizada para Mobile Thumb Zone */}
        <div className="product-action" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '0.75rem', transform: 'translateY(100%)', transition: 'transform 0.3s ease', zIndex: 20 }}>
          <button 
            className={`btn full-width ${added ? 'btn-success' : 'btn-primary'}`}
            onClick={handleAdd}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              padding: '0.6rem', 
              fontSize: '0.85rem',
              backgroundColor: added ? '#10b981' : 'var(--accent)',
              color: 'var(--bg-primary)',
              transition: 'all 0.2s ease'
            }}
          >
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
            {added ? 'Na Sacola VIP' : 'Adicionar Rápido'}
          </button>
        </div>
      </div>

      <div className="product-info" style={{ paddingTop: '1rem' }}>
        <span className="product-category" style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {product.category}
        </span>
        <h3 className="product-name" style={{ fontSize: '1.05rem', fontWeight: 'bold', marginTop: '0.2rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
          {product.name}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="product-price" style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {product.priceFormatted}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ou 3x de {(product.price / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>
    </Link>
  );
}
