import { getProductById, getProducts } from '../../../lib/products';
import { ProductDetailsClient } from './ProductDetailsClient';
import Link from 'next/link';
import { Metadata } from 'next';
import { cache } from 'react';

// 🚀 OTIMIZAÇÃO PERFORMANCE ENTERPRISE: Incremental Static Regeneration (ISR)
// Em vez de forçar SSR bruto a cada requisição (force-dynamic), mantemos a página em cache na Borda
// e revalidamos a cada 1 hora (3600 segundos) sem penalizar o banco de dados.
export const revalidate = 3600;

// ⚡ CACHING FRONT-END & BACK-END: Memoização nativa React/Next.js para chamadas de banco no mesmo escopo
// Evita buscar o mesmo produto duas vezes (uma na Metadata e outra no Componente de Página)
const getCachedProduct = cache(async (id: string) => {
  return await getProductById(id);
});

// 🔍 SEO Dinâmico de Nível Enterprise com TTFB Otimizado
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getCachedProduct(resolvedParams.id);
  
  if (!product) {
    return {
      title: 'Produto não encontrado | Flowfit Premium',
      description: 'A peça solicitada não está disponível no catálogo Flowfit.',
    };
  }

  return {
    title: `${product.name} | Flowfit Premium`,
    description: product.description.substring(0, 155),
    openGraph: {
      title: `${product.name} | Flowfit Premium`,
      description: product.description.substring(0, 155),
      images: [product.image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Flowfit Premium`,
      description: product.description.substring(0, 155),
      images: [product.image],
    }
  };
}

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Paralelização limpa: Busca o produto (com deduplicação via cache de requisição) e o catálogo de cross-sell
  const [product, allProducts] = await Promise.all([
    getCachedProduct(resolvedParams.id),
    getProducts()
  ]);

  if (!product) {
    return (
      <div className="container section text-center" style={{ paddingTop: '150px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Produto não encontrado</h2>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Voltar para o Catálogo
        </Link>
      </div>
    );
  }

  // Schema.org Estruturado para Rich Snippets no Google Search e Google Shopping
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    offers: {
      '@type': 'Offer',
      url: `https://flowfit.com/product/${product.id}`,
      priceCurrency: 'BRL',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      {/* Script JSON-LD Injetado no Server Component sem bloquear a linha principal (Main Thread) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailsClient product={product} allProducts={allProducts} />
    </>
  );
}
