import { getProductById, getProducts } from '../../../lib/products';
import { ProductDetailsClient } from './ProductDetailsClient';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute

// 🔍 SEO Dinâmico de Nível Enterprise (Audit Item P0)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  
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
  const [product, allProducts] = await Promise.all([
    getProductById(resolvedParams.id),
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
      {/* Script JSON-LD Injetado no Server Component */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailsClient product={product} allProducts={allProducts} />
    </>
  );
}
