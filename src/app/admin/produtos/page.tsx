import { prisma } from '../../../lib/prisma';
import { ProductsTable } from './ProductsTable';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        images: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  // Converte tipos complexos (Decimal do Prisma) para JSON puro aceito por Client Components
  const serializedProducts = products.map(p => ({
    ...p,
    price: Number(p.price)
  }));

  return (
    <div style={{ padding: '3rem' }}>
      <ProductsTable products={serializedProducts} categories={categories} />
    </div>
  );
}
