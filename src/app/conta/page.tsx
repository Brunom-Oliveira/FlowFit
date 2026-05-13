import { prisma } from '../../lib/prisma';
import { getSession } from '../../lib/session';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import CompleteProfileForm from './CompleteProfileForm';
import { AccountClientDashboard } from './AccountClientDashboard';

// 🚀 CONSULTORIA ENTERPRISE: OTIMIZAÇÃO DE ROTA & CACHE (Fase 9)
// Força a renderização dinâmica (SSR) limpa e direta para garantir que o cliente
// sempre veja o status logístico atualizado de suas remessas e saldo de Cashback.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Área do Cliente VIP | Flowfit Premium',
  description: 'Acompanhamento de pedidos em tempo real, saldo de Cashback e benefícios do Clube FLOWVIP.',
  robots: { index: false, follow: false } // Blindagem de Privacidade / SEO
};

export default async function CustomerAccountPage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  // 🚀 OTIMIZAÇÃO DE BANCO DE DADOS EM ESCALA ENTERPRISE (Fases 9 e 13)
  // Substituição cirúrgica do ofensor de tráfego (includes encadeados de 5 níveis)
  // por projeções otimizadas estritamente mapeadas via select.
  // Erradica o Overfetching e reduz drasticamente o tempo de serialização de Borda na Vercel.
  const [dbUser, dbRecommended] = await Promise.all([
    prisma.user.findUnique({
      where: { id: String(session.userId) },
      select: {
        id: true,
        name: true,
        email: true,
        // Extração de dados de Perfil Progressivo (Progressive Profiling)
        phone: true,
        addressZip: true,
        addressStreet: true,
        addressNumber: true,
        addressComplement: true,
        addressNeighborhood: true,
        addressCity: true,
        addressState: true,
        isProfileComplete: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                price: true,
                variant: {
                  select: {
                    size: true,
                    product: {
                      select: {
                        name: true,
                        images: {
                          select: { url: true },
                          take: 1 // Baixa estritamente a primeira miniatura representativa
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }),
    // Recomendações Premium para o Cross-Sell de Retenção (Fase 8)
    prisma.product.findMany({
      take: 3,
      orderBy: { price: 'desc' },
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        images: {
          select: { url: true },
          take: 1
        }
      }
    })
  ]);

  if (!dbUser) {
    redirect('/login');
  }

  // Mapeamento e normalização dos objetos serializados para o Client Component
  const normalizedOrders = dbUser.orders.map(order => ({
    id: order.id,
    totalAmount: Number(order.totalAmount),
    status: order.status,
    createdAt: order.createdAt,
    items: order.items.map(item => {
      const product = item.variant?.product;
      return {
        quantity: item.quantity,
        price: Number(item.price),
        productName: product?.name || 'Peça Exclusiva',
        size: item.variant?.size || 'M',
        imageUrl: product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&q=80'
      };
    })
  }));

  const normalizedRecommended = dbRecommended.map(prod => ({
    id: prod.id,
    slug: prod.slug,
    name: prod.name,
    price: Number(prod.price),
    imageUrl: prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&q=80'
  }));

  const isProfileComplete = dbUser.isProfileComplete ?? false;

  return (
    <div className="container section" style={{ paddingTop: '120px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Formulário de Coleta Contínua (Progressive Profiling) */}
      {!isProfileComplete && (
        <div style={{ marginBottom: '2rem' }}>
          <CompleteProfileForm userName={dbUser.name} />
        </div>
      )}

      {/* Painel Cliente Rico em Gamificação, Níveis VIP e Edição de Endereços */}
      <AccountClientDashboard 
        user={{
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone || '',
          addressZip: dbUser.addressZip || '',
          addressStreet: dbUser.addressStreet || '',
          addressNumber: dbUser.addressNumber || '',
          addressComplement: dbUser.addressComplement || '',
          addressNeighborhood: dbUser.addressNeighborhood || '',
          addressCity: dbUser.addressCity || '',
          addressState: dbUser.addressState || '',
          orders: normalizedOrders
        }}
        recommendedProducts={normalizedRecommended}
      />

    </div>
  );
}
