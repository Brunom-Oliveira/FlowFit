import { MetadataRoute } from 'next';
import { prisma } from '../../src/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://flowfit.com';

  // Busca todos os produtos ativos direto do banco
  let products: Array<{ id: string; slug: string | null; updatedAt: Date }> = [];
  try {
    products = await prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
    });
  } catch {
    console.warn('[DB FALLBACK] Database unreachable for sitemap. Using static mappings.');
  }

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug || product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/trocas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...staticEntries, ...productEntries];
}
