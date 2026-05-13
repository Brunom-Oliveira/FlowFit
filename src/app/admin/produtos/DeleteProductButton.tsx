"use client";

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '../../actions/products';

export function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja deletar o produto "${productName}"? Esta ação removerá também as imagens e o estoque.`)) {
      startTransition(async () => {
        setErrorMsg(null);
        const res = await deleteProduct(productId);
        if (res?.error) {
          setErrorMsg(res.error);
          setTimeout(() => setErrorMsg(null), 4000);
        }
      });
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        style={{ 
          padding: '0.5rem', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          border: 'none', 
          borderRadius: '6px', 
          color: '#ef4444', 
          cursor: isPending ? 'wait' : 'pointer',
          transition: 'all 0.2s ease'
        }}
        title="Deletar Produto"
      >
        <Trash2 size={18} />
      </button>
      
      {errorMsg && (
        <span style={{ position: 'absolute', right: '100%', marginRight: '0.5rem', whiteSpace: 'nowrap', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', zIndex: 10, animation: 'fadeIn 0.2s ease' }}>
          {errorMsg}
        </span>
      )}
    </div>
  );
}
