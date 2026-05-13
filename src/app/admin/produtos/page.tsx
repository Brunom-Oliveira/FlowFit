import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/session';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { ProductsTable } from './ProductsTable';

// 🚀 CONSULTORIA ENTERPRISE: OTIMIZAÇÃO DE ROTA & CACHE (Fase 9)
// Força renderização dinâmica focada no gestor logístico para que novos cadastros
// e quebras de grade de estoque sejam detectados instantaneamente.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catálogo de Produtos Admin | Flowfit Premium',
  description: 'Gestão corporativa de roupas fitness, edição em massa de SKUs e controle de estoque de Borda.',
  robots: { index: false, follow: false }
};

export default async function AdminProductsPage() {
  const session = await getSession();

  // 🚀 SEGURANÇA ENTERPRISE DE BORDA: RBAC & PRIVILEGE ESCALATION (Fase 8)
  // Rejeita acesso na raiz para operadores sem nível hierárquico suficiente.
  if (!session || !session.userId || session.role !== 'ADMIN') {
    redirect('/login?error=Acesso%20administrativo%20negado.%20Apenas%20contas%20ADMIN.');
  }

  // 🚀 PERFORMANCE EXTREMA DE BANCO DE DADOS E REDE (Fase 9 e 10)
  // Substituição cirúrgica dos ofensores encadeados (include encadeado de imagens e variantes)
  // por seleções otimizadas (select) estritamente tipadas.
  // Garante a eliminação absoluta do Overfetching, trafegando pacotes ultra-compactos na Vercel.
  const [productsDb, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        categoryId: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        images: {
          select: { url: true },
          orderBy: { id: 'asc' }
        },
        variants: {
          select: {
            size: true,
            stock: true,
          },
          orderBy: { size: 'asc' }
        }
      }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      }
    })
  ]);

  // Serialização e normalização preditiva para os Client Components
  const serializedProducts = productsDb.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    categoryId: p.categoryId,
    description: p.description,
    category: p.category,
    images: p.images,
    variants: p.variants
  }));

  return (
    <div className="admin-products-root" style={{ width: '100%', padding: '2.5rem 3rem', maxWidth: '1600px', margin: '0 auto' }}>
      <ProductsTable products={serializedProducts} categories={categories} />
    </div>
  );
}
