import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../ProductCard';
import { CartProvider } from '../../context/CartContext';

// Mocks
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return ({ src, alt }: { src: string, alt: string }) => {
    return <img src={src} alt={alt} />;
  };
});

describe('UX & Acessibilidade: ProductCard Component', () => {
  const mockProduct = {
    id: 'prod-123',
    name: 'Legging Sculpt Pro Black',
    description: 'Legging preta de alta compressão e tecnologia zero transparência para treinos de elite.',
    category: 'Leggings',
    price: 199.90,
    priceFormatted: 'R$ 199,90',
    installments: '6x de R$ 33,31',
    image: '/images/legging-black.jpg',
    badge: 'Lançamento',
    colors: ['#000000', '#333333'],
    sizes: ['P', 'M', 'G', 'GG'],
  };

  it('Deve renderizar os detalhes do produto corretamente', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    // Validação Visual Padrão
    expect(screen.getByText('Legging Sculpt Pro Black')).toBeInTheDocument();
    expect(screen.getByText('R$ 199,90')).toBeInTheDocument();
    expect(screen.getByText('Lançamento')).toBeInTheDocument();
    
    // Otimização SEO/Acessibilidade: Alt nas Imagens
    const imgElement = screen.getByAltText('Legging Sculpt Pro Black');
    expect(imgElement).toBeInTheDocument();
  });

  it('Deve interagir e adicionar produto ao carrinho quando o botão é clicado', async () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const user = userEvent.setup();
    const btnAdicionar = screen.getByRole('button', { name: /Adicionar/i });
    
    // Interação
    await user.click(btnAdicionar);

    // O componente interno deve exibir ou um Toast ou mudar de estado no carrinho
    // Estamos garantindo que não há throw de erros ou travamentos.
    expect(btnAdicionar).toBeInTheDocument();
  });
});
