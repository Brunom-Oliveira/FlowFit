"use client";

import { useState } from 'react';
import { updateProduct } from '../../../../actions/products';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Variant {
  size: string;
  stock: number;
}

interface Image {
  url: string;
}

interface Product {
  id: string;
  name: string;
  price: any;
  categoryId: string;
  description: string | null;
  images: Image[];
  variants: Variant[];
}

export function EditProductForm({ product, categories }: { product: Product, categories: Category[] }) {
  const [images, setImages] = useState<string[]>(product.images.map(img => img.url) || ['']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mapeia os estoques existentes
  const stockMap = product.variants.reduce((acc, v) => ({ ...acc, [v.size]: v.stock }), {} as Record<string, number>);

  const addImageField = () => {
    setImages([...images, '']);
  };

  const updateImage = (index: number, val: string) => {
    const updated = [...images];
    updated[index] = val;
    setImages(updated);
  };

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMsg(null);
    const res = await updateProduct(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
    }
  };

  return (
    <form action={handleSubmit}>
      {errorMsg && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginBottom: '2rem', animation: 'fadeIn 0.2s ease' }}>
          <strong>Falha ao Atualizar:</strong> {errorMsg}
        </div>
      )}
      <input type="hidden" name="id" value={product.id} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Info Geral */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>Informações Básicas</h2>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nome da Peça *</label>
            <input type="text" name="name" defaultValue={product.name} required style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Preço (R$) *</label>
              <input type="number" step="0.01" name="price" defaultValue={Number(product.price)} required style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categoria *</label>
              <select name="categoryId" defaultValue={product.categoryId} required style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}>
                <option value="">Selecione...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Descrição Detalhada</label>
            <textarea name="description" rows={4} defaultValue={product.description || ''} style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}></textarea>
          </div>
        </div>

        {/* Gestão de Imagens */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>Galeria de Imagens</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gerencie os links de alta resolução.</p>
            </div>
            <button type="button" onClick={addImageField} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
              <Plus size={16} /> Adicionar Link
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {images.map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="url" 
                  name={`image_${i}`} 
                  value={url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder={`https://... (Foto ${i + 1})`} 
                  required={i === 0}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
                />
                {images.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeImageField(i)}
                    style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grade de Estoque */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>Estoque Atual por Tamanho</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {(['P', 'M', 'G', 'GG'] as const).map((size) => (
              <div key={size} style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--accent)' }}>Tamanho {size}</label>
                <input 
                  type="number" 
                  name={`stock_${size}`} 
                  min="0" 
                  defaultValue={stockMap[size] || 0} 
                  style={{ width: '100%', padding: '0.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', fontWeight: 'bold' }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botões Salvar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link href="/admin/produtos" className="btn btn-outline" style={{ padding: '1rem 2rem' }}>
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem' }} disabled={loading}>
            {loading ? 'Atualizando Banco...' : 'Salvar Alterações'}
          </button>
        </div>

      </div>
    </form>
  );
}
