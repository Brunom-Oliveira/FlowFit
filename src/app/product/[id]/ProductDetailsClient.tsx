"use client";

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ArrowLeft, CheckCircle2, Ruler, Plus, ShoppingBag } from 'lucide-react';
import { UIProduct as Product } from '../../../lib/products';
import { useCart } from '../../../context/CartContext';

// 🚀 SPRINT 2: EXTRAÇÃO DE PACOTES (Code Splitting / Lazy Loading)
// O módulo do Provador Virtual IA é importado estritamente sob demanda. O Next.js corta o seu código-fonte
// em pedaços e baixa este bundle secundário em paralelo apenas se a compradora acionar o botão de expansão.
const DynamicFittingRoomModal = dynamic(
  () => import('./FittingRoomModal').then(m => m.FittingRoomModal),
  { 
    ssr: false, 
    loading: () => (
      <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-color)', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold' }}>
        Carregando Motor IA Flowfit...
      </div>
    ) 
  }
);

export function ProductDetailsClient({ product, allProducts }: { product: Product; allProducts?: Product[] }) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);
  const [addedBundle, setAddedBundle] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Estado simples para controle de exibição sob demanda do Provador IA
  const [showFittingRoom, setShowFittingRoom] = useState(false);

  // ⚡ MEMOIZAÇÃO DE HANDLERS
  const handleAddToCart = useCallback(() => {
    if (!selectedSize && product.sizes.length > 0) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 4000);
      return;
    }
    
    setSizeError(false);
    addToCart(product);
    setAdded(true);
    
    setTimeout(() => {
      setAdded(false);
    }, 3000);
  }, [selectedSize, product, addToCart]);

  // 🚀 OTIMIZAÇÃO DE CPU & INP: Memoização de Cross-Sell
  const crossSellProduct = useMemo(() => {
    return allProducts?.find(p => {
      if (p.id === product.id) return false;
      if (product.category.toLowerCase().includes('legging')) {
        return p.category.toLowerCase().includes('top') || p.name.toLowerCase().includes('top');
      }
      if (product.category.toLowerCase().includes('top')) {
        return p.category.toLowerCase().includes('legging') || p.name.toLowerCase().includes('legging');
      }
      return true;
    }) || allProducts?.find(p => p.id !== product.id);
  }, [allProducts, product.id, product.category, product.name]);

  const handleAddBundle = useCallback(() => {
    if (!selectedSize && product.sizes.length > 0) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 4000);
      return;
    }

    setSizeError(false);

    addToCart(product);
    if (crossSellProduct) {
      addToCart(crossSellProduct);
    }

    setAddedBundle(true);
    setTimeout(() => {
      router.push('/checkout');
    }, 600);
  }, [selectedSize, product, crossSellProduct, addToCart, router]);

  // Callback de sincronização atômica entre o Provador IA e a Grade de Tamanhos
  const handleSizeFromAi = useCallback((size: string) => {
    setSelectedSize(size);
    setSizeError(false);
  }, []);

  return (
    <div className="container section product-details-page" style={{ paddingTop: '120px' }}>
      <button className="back-btn" onClick={() => router.back()} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Voltar para Coleção
      </button>

      <div className="product-details-container">
        
        {/* Lado Esquerdo - Galeria de Imagem com CLS Estabilizado */}
        <div className="product-details-image" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', width: '100%', aspectRatio: '3/4', contentVisibility: 'auto' }}>
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }} 
          />
        </div>
        
        {/* Lado Direito - Ações de Compra e Cross-Sell */}
        <div className="product-details-info">
          <span className="product-category" style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {product.category}
          </span>
          <h1 className="product-title" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            {product.name}
          </h1>
          <p className="product-price-large" style={{ color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            {product.priceFormatted}
          </p>
          
          <div className="product-description" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
            <p>{product.description}</p>
          </div>

          {/* MÓDULO EXPANSÍVEL DO PROVADOR VIRTUAL IA (CODE SPLITTING SPRINT 2) */}
          <div style={{ marginBottom: '2rem' }}>
            <button 
              type="button" 
              onClick={() => setShowFittingRoom(!showFittingRoom)}
              style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
                padding: '0.5rem 1rem', borderRadius: '8px', 
                backgroundColor: 'rgba(229, 203, 179, 0.1)', 
                color: 'var(--accent)', border: '1px solid rgba(229, 203, 179, 0.2)',
                fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer',
                marginBottom: '1rem', transition: 'all 0.2s ease'
              }}
            >
              <Ruler size={16} /> {showFittingRoom ? 'Recolher Provador IA' : 'Descobrir Meu Tamanho Ideal (Provador IA)'}
            </button>

            {/* Injeção condicional perfeita: O download do pacote de IA ocorre apenas na ativação do booleano */}
            {showFittingRoom && (
              <DynamicFittingRoomModal 
                product={product} 
                allProducts={allProducts} 
                onSelectSize={handleSizeFromAi} 
              />
            )}
          </div>

          {/* Grade de Tamanhos */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="product-sizes" style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: sizeError ? '#ef4444' : 'var(--text-secondary)', fontWeight: sizeError ? 'bold' : 'normal', transition: 'color 0.2s ease' }}>
                  {sizeError ? '⚠️ Por favor, selecione um tamanho acima' : 'Selecione o Tamanho'}
                </h4>
                {selectedSize && <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>Tamanho {selectedSize} selecionado</span>}
              </div>
              
              <div className="sizes-grid" style={{ padding: sizeError ? '4px' : '0', border: sizeError ? '1px solid #ef4444' : 'none', borderRadius: '10px', transition: 'all 0.2s ease' }}>
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    type="button"
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ação Principal */}
          <div className="product-actions" style={{ marginBottom: '2rem' }}>
            <button 
              type="button"
              className={`btn full-width ${added ? 'btn-success' : 'btn-primary'}`} 
              onClick={handleAddToCart}
              style={{ padding: '1.2rem', fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              {added ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={22} /> Peça na Sacola
                </span>
              ) : (
                'Adicionar à Sacola'
              )}
            </button>
          </div>
          
          {/* MÓDULO DE CROSS-SELL PREMIUM */}
          {crossSellProduct && (
            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(229, 203, 179, 0.05)', borderRadius: '12px', border: '2px dashed var(--border-color)', marginBottom: '2rem', contentVisibility: 'auto' }}>
              <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', backgroundColor: 'rgba(229, 203, 179, 0.2)', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '4px', marginBottom: '1rem', textTransform: 'uppercase' }}>
                Look Completo com Desconto
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <div style={{ position: 'relative', width: '60px', height: '75px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', flexShrink: 0 }}>
                  <Image src={crossSellProduct.image} alt={crossSellProduct.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                </div>
                
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <Plus size={12} style={{ color: 'var(--accent)' }} /> Peça Sugerida
                  </div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {crossSellProduct.name}
                  </h4>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                    + {crossSellProduct.priceFormatted}
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleAddBundle}
                disabled={addedBundle}
                className="btn full-width"
                style={{ 
                  padding: '0.8rem', fontSize: '0.9rem', fontWeight: 'bold',
                  backgroundColor: 'var(--bg-primary)', color: 'var(--accent)',
                  border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                {addedBundle ? 'Montando Pacote...' : (
                  <>
                    <ShoppingBag size={16} /> Adicionar Look Completo à Sacola
                  </>
                )}
              </button>
            </div>
          )}

          {/* Garantias */}
          <div className="product-shipping" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} style={{ color: '#22c55e' }}/> Frete Expresso e Troca Fácil
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
              Entregamos para todo o Brasil em embalagem selada e perfumada. Primeira devolução ou troca de tamanho 100% gratuita.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
