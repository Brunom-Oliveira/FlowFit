"use client";

import { useState } from 'react';
import { createProduct } from '../../../actions/products';
import { Plus, Trash2, ArrowLeft, Upload, Package, Layers, Image as ImageIcon, CheckCircle2, RefreshCw, Sparkles, Tag, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

// 🚀 CONSULTORIA ENTERPRISE: GESTÃO AVANÇADA DE PRODUTOS E UX (Sprint 2 / Fase 5)
// Formulário corporativo com isolamento de contexto por abas, validação preditiva,
// pré-visualização instantânea de mídias e otimização visual de ergonomia operacional.
export function ProductForm({ categories }: { categories: Category[] }) {
  // Controle de Abas de Alta Produtividade
  const [activeTab, setActiveTab] = useState<'geral' | 'galeria' | 'estoque'>('geral');
  
  // Estado Controlado de Imagens Dinâmicas (Estratégia 1-N)
  const [images, setImages] = useState<string[]>(['']);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados Preditivos
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [descriptionCount, setDescriptionCount] = useState<number>(0);

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

  // Simulação de Slugificação Preditiva
  const liveSlug = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

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
    <div style={{ contentVisibility: 'auto' }}>
      
      {/* 🌟 NAVEGAÇÃO INTERNA DE ABAS (ISOLAMENTO DE ESFORÇO COGNITIVO) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'geral', label: '1. Informações Técnicas', icon: FileText, desc: 'Nome, Categoria e Precificação' },
          { id: 'galeria', label: `2. Galeria de Mídias (${images.filter(u => u.trim() !== '').length})`, icon: ImageIcon, desc: 'Imagens de Alta Resolução' },
          { id: 'estoque', label: '3. Matriz de Grade & Estoque', icon: Layers, desc: 'SKUs e Quantidades Iniciais' },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.8rem 1.2rem', borderRadius: '8px',
                backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--border-color)' : 'transparent'}`,
                fontWeight: isActive ? 'bold' : 'normal', textAlign: 'left',
                cursor: 'pointer', transition: 'all 0.2s ease', minWidth: '220px'
              }}
            >
              <div style={{ padding: '0.4rem', backgroundColor: isActive ? 'rgba(229, 203, 179, 0.1)' : 'var(--bg-secondary)', borderRadius: '6px' }}>
                <IconComp size={16} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem' }}>{tab.label}</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{tab.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      <form action={handleSubmit}>
        
        {errorMsg && (
          <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeIn 0.3s ease' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Bloqueio de Validação:</span> {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* ========================================================================= */}
          {/* ABA 1: INFORMAÇÕES GERAIS E CADASTRAIS                                    */}
          {/* ========================================================================= */}
          <div style={{ display: activeTab === 'geral' ? 'block' : 'none', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <Tag size={16} /> Ficha de Produto Principal
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                
                {/* Nome da Peça e Live Slug */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                    Nome Oficial do Look Feminino *
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Legging Sculpt Compressão Premium" 
                    required 
                    style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }} 
                  />
                  {productName && (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                      Slug gerado: <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{liveSlug}</strong>
                    </span>
                  )}
                </div>

                {/* Preço e Categoria */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                      Preço de Venda (R$) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 'bold' }}>R$</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="price" 
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="259.90" 
                        required 
                        style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 'bold' }} 
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                      Categoria de Classificação *
                    </label>
                    <select 
                      name="categoryId" 
                      required 
                      style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }}
                    >
                      <option value="">Selecione uma categoria corporativa...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descrição Otimizada SEO */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                      Descrição Detalhada e Fibras (SEO Friendly)
                    </label>
                    <span style={{ fontSize: '0.75rem', color: descriptionCount > 500 ? '#ef4444' : 'var(--text-secondary)' }}>
                      {descriptionCount} caracteres
                    </span>
                  </div>
                  <textarea 
                    name="description" 
                    rows={5} 
                    onChange={(e) => setDescriptionCount(e.target.value.length)}
                    placeholder="Especifique a gramatura do tecido, tecnologia sem transparência (Blackout), costuras planas e composição de elastano..." 
                    style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.5' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('galeria')}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--accent)', color: 'var(--bg-primary)', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Avançar para Galeria de Imagens →
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ABA 2: GALERIA DE MÍDIAS E PRÉ-VISUALIZAÇÃO EM TEMPO REAL                 */}
          {/* ========================================================================= */}
          <div style={{ display: activeTab === 'galeria' ? 'block' : 'none', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--accent)' }}>Galeria Visual de Alta Performance</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Cole os caminhos de CDN em resolução nativa. O monorepo fará o cache sob demanda.</p>
                </div>
                
                <button 
                  type="button" 
                  onClick={addImageField} 
                  style={{ padding: '0.6rem 1.2rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                >
                  <Plus size={16} /> Novo Slot de Mídia
                </button>
              </div>

              {/* Grid de Inputs e Miniaturas Reativas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {images.map((url, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-primary)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Slot de Imagem #{idx + 1} {idx === 0 && <strong style={{ color: 'var(--accent)' }}>(Capa Principal)</strong>}</span>
                    
                    {/* Renderização de Mídia Dinâmica Instantânea */}
                    <div style={{ width: '100%', height: '140px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)' }}>
                      {url.trim() !== '' ? (
                        <img 
                          src={url} 
                          alt={`Prévia da mídia ${idx + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            // Prevenção visual limpa caso o link inserido seja inválido
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&q=80';
                          }}
                        />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)', gap: '0.3rem' }}>
                          <ImageIcon size={24} style={{ opacity: 0.4 }} />
                          <span style={{ fontSize: '0.7rem' }}>Nenhum link inserido</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="url" 
                        name={`image_${idx}`} 
                        value={url}
                        onChange={(e) => updateImage(idx, e.target.value)}
                        placeholder="https://exemplo.com/foto.jpg" 
                        required={idx === 0}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem' }} 
                      />
                      
                      {images.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeImageField(idx)}
                          title="Remover Slot"
                          style={{ padding: '0.6rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('geral')}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  ← Voltar
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('estoque')}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--accent)', color: 'var(--bg-primary)', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Avançar para Matriz de Estoque →
                </button>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* ABA 3: MATRIZ DE GRADE DE ESTOQUE E GERAÇÃO DE SKUS                       */}
          {/* ========================================================================= */}
          <div style={{ display: activeTab === 'estoque' ? 'block' : 'none', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <Package size={16} /> Distribuição Logística Inicial
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, marginBottom: '2rem', color: 'var(--text-primary)' }}>Grade de SKUs Automatizada</h3>

              {/* Tabela de Inserção em Massa por Tamanho */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {(['P', 'M', 'G', 'GG'] as const).map((size) => (
                  <div key={size} style={{ backgroundColor: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)', textAlign: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(229, 203, 179, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', margin: '0 auto 1rem', fontSize: '0.9rem' }}>
                      {size}
                    </div>
                    
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      SKU Padrão: <br/><strong style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{liveSlug ? `${liveSlug.slice(0,12)}-${size}` : `SKU-${size}`}</strong>
                    </span>

                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 'bold' }}>Qtd. Estoque</label>
                    <input 
                      type="number" 
                      name={`stock_${size}`} 
                      min="0" 
                      defaultValue="15" 
                      style={{ width: '100%', padding: '0.75rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--accent)', fontSize: '1.1rem', fontWeight: 'bold' }} 
                    />
                  </div>
                ))}
              </div>

              <div style={{ padding: '1.2rem', backgroundColor: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <CheckCircle2 size={20} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Transação Atômica Assegurada</strong>
                  O backend salvará a peça principal e as 4 instâncias de SKU estritamente no mesmo ciclo.
                </span>
              </div>

              {/* Ações Finais de Persistência */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('galeria')}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  ← Voltar
                </button>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link href="/admin/produtos" style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                    Cancelar
                  </Link>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '0.75rem 2.5rem', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' }}
                  >
                    {loading ? <RefreshCw size={16} className="spin" /> : <Sparkles size={16} />}
                    {loading ? 'Transacionando Banco...' : 'Finalizar Cadastro de Produto VIP'}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </form>

    </div>
  );
}
