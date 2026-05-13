import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getProducts } from '../lib/products';
import { ProductCard } from '../components/ProductCard';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const products = await getProducts();
  const topProducts = products.slice(0, 4); // Only show a few on home

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <Image 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80" 
            alt="Atleta correndo - Flowfit" 
            fill
            priority
            sizes="100vw"
            className="hero-img"
            style={{ objectFit: 'cover' }}
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-content animate-fade-in">
          <span className="hero-subtitle delay-100">NOVA COLEÇÃO</span>
          <h1 className="hero-title delay-200">
            SUPERE SEUS <br/> <span className="text-accent">LIMITES</span>
          </h1>
          <p className="hero-desc delay-300">
            Roupas projetadas para máxima performance e conforto inigualável. Não aceite menos que o seu melhor.
          </p>
          <div className="hero-actions delay-300">
            <Link href="/shop" className="btn btn-primary">
              Comprar Agora <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link href="/shop" className="btn btn-outline">Ver Coleção</Link>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section id="produtos" className="trending container section">
        <div className="section-header">
          <h2 className="section-title">MAIS VENDIDOS</h2>
          <Link href="/shop" className="link-all">Ver todos</Link>
        </div>
        
        <div className="product-grid">
          {topProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section className="feature section bg-secondary">
        <div className="container feature-container">
          <div className="feature-content">
            <h2>TECNOLOGIA QUE SE MOVE COM VOCÊ</h2>
            <p>
              Nossos tecidos são desenvolvidos com a tecnologia Dry-Fit avançada, garantindo respirabilidade, secagem ultrarrápida e compressão na medida certa para seus treinos mais intensos.
            </p>
            <ul className="feature-list" style={{ listStyle: 'none', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>✓ Secagem rápida</li>
              <li>✓ Proteção UV50+</li>
              <li>✓ Zero transparência</li>
            </ul>
          </div>
          <div className="feature-image-container" style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden' }}>
            <Image 
              src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80" 
              alt="Treino intenso" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }} 
            />
          </div>
        </div>
      </section>
    </>
  );
}
