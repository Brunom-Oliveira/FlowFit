import { prisma } from '../../../../lib/prisma';
import { ProductForm } from './ProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/admin/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
          <ArrowLeft size={18} /> Voltar para Produtos
        </Link>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Cadastrar Nova Peça</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Preencha os dados técnicos e adicione links otimizados de imagem.</p>
      </header>

      <ProductForm categories={categories} />
    </div>
  );
}
