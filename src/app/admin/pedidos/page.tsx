import { prisma } from '../../../lib/prisma';
import { OrderStatusSelect } from './OrderStatusSelect';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export const revalidate = 0;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedParams.page || '1', 10) || 1);
  const perPage = 20;

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: perPage,
      skip: (currentPage - 1) * perPage,
    }),
    prisma.order.count(),
  ]);

  const totalPages = Math.ceil(totalOrders / perPage);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  return (
    <div style={{ padding: '3rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Gestão de Pedidos</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Acompanhe as vendas, atualize os status logísticos e verifique remessas.</p>
      </header>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        {orders.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>Nenhum pedido registrado no banco de dados.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '1.2rem 1.5rem' }}>ID do Pedido</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Cliente</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Itens da Compra</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Data</th>
                  <th style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center', width: '140px' }}>Status Logístico</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    
                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent)' }}>
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ fontWeight: 'bold' }}>{order.user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.user.email}</div>
                    </td>

                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ color: 'var(--text-primary)' }}>
                            <strong>{item.quantity}x</strong> {item.variant.product.name} <span style={{ color: 'var(--accent)' }}>({item.variant.size})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {formatDate(order.createdAt)}
                    </td>

                    <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {formatPrice(Number(order.totalAmount))}
                    </td>

                    <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
            {currentPage > 1 && (
              <Link href={`/admin/pedidos?page=${currentPage - 1}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Anterior
              </Link>
            )}
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Página {currentPage} de {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link href={`/admin/pedidos?page=${currentPage + 1}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Próxima
              </Link>
            )}
          </div>
        )}
    </div>
  );
}
