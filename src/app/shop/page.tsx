import { getProducts } from '../../lib/products';
import { ProductCard } from '../../components/ProductCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60;

// 🔍 Geração Semântica de Metadados Avançados por Categoria (Audit Item P0 / E-commerce SEO)
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string }> }): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || 'Geral';
  
  const titles: Record<string, string> = {
    Geral: 'Roupas Fitness Femininas Premium | Catálogo Flowfit',
    Leggings: 'Leggings Fitness Premium com Alta Compressão | Flowfit',
    Tops: 'Tops de Academia com Alta Sustentação | Flowfit Premium',
    Conjuntos: 'Conjuntos Fitness Femininos Elegantes | Flowfit',
    Shorts: 'Shorts de Academia Femininos e de Corrida | Flowfit',
    Casacos: 'Casacos e Corta-Ventos Esportivos Femininos | Flowfit',
    Regatas: 'Regatas e Blusas Dry Fit para Treino | Flowfit',
  };

  const descriptions: Record<string, string> = {
    Geral: 'Explore nossa coleção premium de roupas de academia para mulheres. Peças com tecnologia Zero Transparência, alta compressão e caimento perfeito.',
    Leggings: 'Compre leggings femininas com modelagem anatômica, cintura alta e tecido de toque gelado. Garantia de conforto absoluto sem marcar.',
    Tops: 'Tops esportivos desenvolvidos para treinos de alto impacto. Sustentação máxima, bojo removível e design moderno para compor seus looks.',
    Conjuntos: 'Looks completos combinando tops e leggings com texturas exclusivas. Economize e treine com sofisticação incomparável.',
    Shorts: 'Shorts com cós duplo anatômico que não enrola na perna. Ideais para musculação, crossfit e corrida ao ar livre.',
    Casacos: 'Proteção térmica leve e respirável para os seus dias de treino no inverno. Design acinturado premium.',
    Regatas: 'Tecidos ultraleves de secagem rápida com tratamento antiodor. Frescor e liberdade de movimento garantidos.',
  };

  const title = titles[category] || titles.Geral;
  const description = descriptions[category] || descriptions.Geral;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function Shop({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const products = await getProducts();
  const resolvedParams = await searchParams;
  const activeFilter = resolvedParams.category || 'Todos';
  
  const categories = ['Todos', 'Leggings', 'Tops', 'Conjuntos', 'Shorts', 'Casacos', 'Regatas'];

  const filteredProducts = activeFilter === 'Todos' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  // Marcação Semântica JSON-LD (CollectionPage e ItemList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: activeFilter === 'Todos' ? 'Catálogo Completo Flowfit' : `Coleção de ${activeFilter} Flowfit`,
    description: 'Catálogo oficial de roupas esportivas premium desenvolvidas para o corpo da mulher brasileira.',
    url: `https://flowfit.com/shop${activeFilter !== 'Todos' ? `?category=${activeFilter}` : ''}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: filteredProducts.map((prod, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://flowfit.com/product/${prod.id}`,
        name: prod.name,
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container section" style={{ paddingTop: '120px' }}>
        <div className="section-header" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span className="hero-subtitle" style={{ marginBottom: '1rem' }}>CATÁLOGO COMPLETO</span>
          <h1 className="section-title">
            {activeFilter === 'Todos' ? 'Nossa Coleção' : `Coleção ${activeFilter}`}
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginTop: '1rem' }}>
            Explore nossa linha completa de roupas fitness de alta performance. Desenvolvidas com tecnologia de ponta para acompanhar seus movimentos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '3rem', justifyContent: 'center' }}>
          {categories.map(category => (
            <Link
              key={category}
              href={category === 'Todos' ? '/shop' : `/shop?category=${category}`}
              className={`btn ${activeFilter === category ? 'btn-primary' : 'btn-outline'}`}
              style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
            <p>Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </>
  );
}
