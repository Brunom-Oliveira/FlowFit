"use client";

import { useState } from 'react';
import { createProduct } from '../../../actions/products';
import { Plus, Trash2, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

export function ProductForm({ categories }: { categories: Category[] }) {
  const [images, setImages] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    const res = await createProduct(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
    }
  };

  return (
    <form action={handleSubmit}>
      {errorMsg && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginBottom: '2rem', animation: 'fadeIn 0.2s ease' }}>
          <strong>Falha ao Cadastrar:</strong> {errorMsg}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Info Geral */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>Informações Básicas</h2>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nome da Peça *</label>
            <input type="text" name="name" placeholder="Ex: Legging Sculpt Premium" required style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Preço (R$) *</label>
              <input type="number" step="0.01" name="price" placeholder="259.90" required style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categoria *</label>
              <select name="categoryId" required style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}>
                <option value="">Selecione...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Descrição Detalhada</label>
            <textarea name="description" rows={4} placeholder="Tecnologia do tecido, compressão, toque macio..." style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}></textarea>
          </div>
        </div>

        {/* Gestão de Imagens (Estratégia 1-N) */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>Galeria de Imagens</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cole os links diretos (CDN/Nuvem) em alta resolução.</p>
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
                  placeholder={`https://images.unsplash.com/... (Foto ${i + 1})`} 
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
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>Estoque Inicial por Tamanho</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {(['P', 'M', 'G', 'GG'] as const).map((size) => (
              <div key={size} style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--accent)' }}>Tamanho {size}</label>
                <input 
                  type="number" 
                  name={`stock_${size}`} 
                  min="0" 
                  defaultValue="10" 
                  style={{ width: '100%', padding: '0.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', fontWeight: 'bold' }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botão Salvar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link href="/admin/produtos" className="btn btn-outline" style={{ padding: '1rem 2rem' }}>
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem' }} disabled={loading}>
            {loading ? 'Salvando no Banco...' : 'Cadastrar Produto'}
          </button>
        </div>

      </div>
    </form>
  );
}
