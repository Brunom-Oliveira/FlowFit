"use client";

import { useState, useCallback, memo } from 'react';
import { Sparkles } from 'lucide-react';
import { UIProduct as Product } from '../../../lib/products';

interface FittingRoomModalProps {
  product: Product;
  allProducts?: Product[];
  onSelectSize: (size: string) => void;
}

// 🚀 SPRINT 2 (Code Splitting & Lazy Loading Enterprise)
// Componente autônomo e de carregamento tardio (Lazy Loaded via next/dynamic).
// O seu código JavaScript e a biblioteca de ícones não trafegam na renderização inicial da página,
// preservando a largura de banda e a memória de alocação no celular das compradoras.
export const FittingRoomModal = memo(function FittingRoomModal({ product, allProducts, onSelectSize }: FittingRoomModalProps) {
  const [weight, setWeight] = useState<number>(62);
  const [height, setHeight] = useState<number>(165);
  const [aiResult, setAiResult] = useState<{ ideal: string; available: boolean; altProduct: Product | null } | null>(null);

  const calculateRecommendation = useCallback(() => {
    let rec = 'M';
    if (weight < 55) rec = 'P';
    else if (weight >= 55 && weight < 68) rec = 'M';
    else if (weight >= 68 && weight < 82) rec = 'G';
    else rec = 'GG';

    const isAvailable = product.sizes.includes(rec);
    
    let altProd: Product | null = null;
    if (!isAvailable && allProducts) {
      altProd = allProducts.find(p => p.id !== product.id && p.sizes.includes(rec)) || null;
    }

    setAiResult({
      ideal: rec,
      available: isAvailable,
      altProduct: altProd
    });

    if (isAvailable) {
      onSelectSize(rec);
    }
  }, [weight, product.sizes, product.id, allProducts, onSelectSize]);

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease', contentVisibility: 'auto' }}>
      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sparkles size={16} style={{ color: 'var(--accent)' }} /> Algoritmo de Biotipo Flowfit
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span>Peso Estimado:</span>
            <strong style={{ color: 'var(--accent)' }}>{weight} kg</strong>
          </div>
          <input 
            type="range" min="40" max="110" value={weight} 
            onChange={(e) => setWeight(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span>Altura:</span>
            <strong style={{ color: 'var(--accent)' }}>{height} cm</strong>
          </div>
          <input 
            type="range" min="145" max="185" value={height} 
            onChange={(e) => setHeight(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </div>
      </div>

      <button 
        type="button" 
        onClick={calculateRecommendation}
        className="btn btn-outline full-width"
        style={{ padding: '0.6rem', fontSize: '0.85rem' }}
      >
        Calcular Caimento Perfeito
      </button>

      {aiResult && (
        <div style={{ marginTop: '1.2rem', animation: 'fadeIn 0.3s ease' }}>
          {aiResult.available ? (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px', border: '1px solid #22c55e', color: '#22c55e', fontSize: '0.85rem', textAlign: 'center', fontWeight: 'bold' }}>
              ✓ Recomendamos o tamanho: {aiResult.ideal} (Disponível na loja!)
            </div>
          ) : (
            <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'left' }}>
              <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                ⚠️ Numeração Ideal {aiResult.ideal} Esgotada
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                O nosso sistema calculou que o seu caimento sob medida para este modelo seria o tamanho <strong>{aiResult.ideal}</strong>, mas a grade está temporariamente indisponível.
              </p>
              
              {aiResult.altProduct && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
                    💡 Peça similar em estoque no tamanho {aiResult.ideal}:
                  </span>
                  <a 
                    href={`/product/${aiResult.altProduct.id}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none' }}
                  >
                    Conhecer {aiResult.altProduct.name} →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
