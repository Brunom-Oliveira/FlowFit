import { prisma } from './prisma';

export interface UIProduct {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  category: string;
  image: string;
  description: string;
  sizes: string[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 🚀 Busca Paginada Otimizada para Prevenir estouro de Memória (Audit Item P1)
export async function getProducts(options?: { page?: number; limit?: number; categoryId?: string }): Promise<UIProduct[]> {
  const page = options?.page || 1;
  const limit = options?.limit || 40; // Default seguro O(1) de carga na Vercel RAM
  const skip = (page - 1) * limit;

  const whereClause = options?.categoryId ? { categoryId: options.categoryId } : {};

  const dbProducts = await prisma.product.findMany({
    where: whereClause,
    take: limit,
    skip,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      variants: true,
      images: true,
    }
  });

  return dbProducts.map(product => {
    const sizes = Array.from(new Set(product.variants.map(v => v.size)));
    const priceNumber = Number(product.price);
    const priceFormatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceNumber);

    return {
      id: product.id,
      name: product.name,
      price: priceNumber,
      priceFormatted,
      category: product.category?.name || 'Geral',
      image: product.images[0]?.url || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
      description: product.description,
      sizes,
    };
  });
}

// Busca Total Paginada com Metadados (Para interfaces de Scroll Infinito ou Paginação avançada)
export async function getProductsWithMetadata(page = 1, limit = 20): Promise<PaginatedResult<UIProduct>> {
  const skip = (page - 1) * limit;
  
  const [total, products] = await Promise.all([
    prisma.product.count(),
    getProducts({ page, limit })
  ]);

  return {
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getProductById(id: string): Promise<UIProduct | null> {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id },
        { slug: id }
      ]
    },
    include: {
      category: true,
      variants: true,
      images: true,
    }
  });

  if (!product) return null;

  const sizes = Array.from(new Set(product.variants.map(v => v.size)));
  const priceNumber = Number(product.price);
  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceNumber);

  return {
    id: product.id,
    name: product.name,
    price: priceNumber,
    priceFormatted,
    category: product.category?.name || 'Geral',
    image: product.images[0]?.url || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    description: product.description,
    sizes,
  };
}
