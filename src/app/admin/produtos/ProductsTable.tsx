"use client";

import { useState, useTransition } from 'react';
import { Package, Image as ImageIcon, Edit, Trash2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct, updateProduct } from '../../actions/products';

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
  category?: Category | null;
  images: Image[];
  variants: Variant[];
}

export function ProductsTable({ products, categories }: { products: Product[], categories: Category[] }) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o produto "${productName}"?`)) {
      startTransition(async () => {
        setErrorMsg(null);
        const res = await deleteProduct(productId);
        if (res?.error) setErrorMsg(res.error);
      });
    }
  };

  // Funções de Imagem do Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setErrorMsg(null);
    setImages(p.images.map(img => img.url) || ['']);
  };

  const addImageField = () => setImages([...images, '']);
  const updateImage = (index: number, val: string) => {
    const updated = [...images];
    updated[index] = val;
    setImages(updated);
  };
  const removeImageField = (index: number) => {
    if (images.length > 1) setImages(images.filter((_, i) => i !== index));
  };

  const handleUpdateSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMsg(null);
    const res = await updateProduct(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
    } else {
      setEditingProduct(null);
      setLoading(false);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Produtos</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie o catálogo, edite rapidamente em modal e controle estoques.</p>
        </div>
        <Link href="/admin/produtos/novo" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Novo Produto
        </Link>
      </header>

      {errorMsg && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginBottom: '2rem', animation: 'fadeIn 0.2s ease' }}>
          <strong>Erro de Regra de Negócio:</strong> {errorMsg}
        </div>
      )}

      {/* Tabela */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        {products.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>Nenhum produto cadastrado no banco de dados.</p>
            <Link href="/admin/produtos/novo" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
              Cadastrar Primeiro Produto
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '1.2rem 1.5rem', width: '80px' }}>Foto</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Produto</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Categoria</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Imagens</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Estoque (P/M/G/GG)</th>
                  <th style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>Preço</th>
                  <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center', width: '100px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const stockMap = product.variants.reduce((acc, v) => ({ ...acc, [v.size]: v.stock }), {} as Record<string, number>);

                  return (
                    <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ width: '50px', height: '60px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
                          {product.images[0] ? (
                            <img src={product.images[0].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{product.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {product.id.slice(0, 8)}</div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: '99px', fontSize: '0.8rem' }}>
                          {product.category?.name || 'Sem Categoria'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ImageIcon size={14} /> {product.images.length}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
                          {['P', 'M', 'G', 'GG'].map(size => {
                            const qty = stockMap[size] || 0;
                            return (
                              <span key={size} style={{ 
                                padding: '0.2rem 0.4rem', 
                                borderRadius: '4px', 
                                backgroundColor: qty > 0 ? 'rgba(229, 203, 179, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                                color: qty > 0 ? 'var(--accent)' : 'var(--text-secondary)',
                                border: `1px solid ${qty > 0 ? 'rgba(229, 203, 179, 0.3)' : 'rgba(255,255,255,0.05)'}`
                              }}>
                                {size}: <strong>{qty}</strong>
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--accent)' }}>
                        {formatPrice(Number(product.price))}
                      </td>

                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button 
                            onClick={() => openEditModal(product)}
                            style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: 'none', borderRadius: '6px', color: '#3b82f6', cursor: 'pointer' }}
                            title="Editar em Modal"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={isPending}
                            style={{ padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: isPending ? 'wait' : 'pointer' }}
                            title="Deletar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO */}
      {editingProduct && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', 
          zIndex: 99999, overflowY: 'auto', padding: '3rem 1rem'
        }}>
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)', width: '100%', maxWidth: '800px', 
            borderRadius: '16px', border: '1px solid var(--border-color)', 
            padding: '2.5rem', position: 'relative', margin: 'auto'
          }}>
            
            <button 
              onClick={() => setEditingProduct(null)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>
              Editar Peça: {editingProduct.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Ajuste instantaneamente as informações no banco sem sair da tela.
            </p>

            <form action={handleUpdateSubmit}>
              <input type="hidden" name="id" value={editingProduct.id} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nome da Peça</label>
                  <input type="text" name="name" defaultValue={editingProduct.name} required style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Preço (R$)</label>
                    <input type="number" step="0.01" name="price" defaultValue={Number(editingProduct.price)} required style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categoria</label>
                    <select name="categoryId" defaultValue={editingProduct.categoryId} required style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Descrição</label>
                  <textarea name="description" rows={3} defaultValue={editingProduct.description || ''} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}></textarea>
                </div>

                {/* Imagens */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold' }}>Links das Imagens</label>
                    <button type="button" onClick={addImageField} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Plus size={14} /> Adicionar
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {images.map((url, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="url" name={`image_${i}`} value={url} onChange={(e) => updateImage(i, e.target.value)} required={i === 0} style={{ flex: 1, padding: '0.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem' }} />
                        {images.length > 1 && (
                          <button type="button" onClick={() => removeImageField(i)} style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estoques */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '1rem' }}>Ajustar Estoques</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {(['P', 'M', 'G', 'GG'] as const).map(size => {
                      const currentStock = editingProduct.variants.find(v => v.size === size)?.stock || 0;
                      return (
                        <div key={size} style={{ textAlign: 'center', backgroundColor: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '6px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{size}</span>
                          <input type="number" name={`stock_${size}`} defaultValue={currentStock} min="0" style={{ width: '100%', padding: '0.25rem', textAlign: 'center', backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1rem' }} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Botoes */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
                    Fechar
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>

              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
