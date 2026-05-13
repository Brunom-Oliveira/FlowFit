import { prisma } from '../../../lib/prisma';
import { Users, Award, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Role } from '@prisma/client';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  // Busca todos os clientes com seus pedidos para calcular o LTV (Life Time Value)
  const customers = await prisma.user.findMany({
    where: { role: Role.CUSTOMER },
    include: {
      orders: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  // Cálculos do CRM Corporativo
  const totalCustomers = customers.length;
  const totalLTV = customers.reduce((acc, user) => {
    const userSpent = user.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    return acc + userSpent;
  }, 0);
  const avgTicket = totalCustomers > 0 ? totalLTV / customers.reduce((acc, u) => acc + u.orders.length, 0) || 0 : 0;

  return (
    <div style={{ padding: '3rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Clientes & CRM</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Auditoria de consumidoras, histórico de aquisições e cálculo de LTV (Lifetime Value).</p>
      </header>

      {/* Métricas do CRM */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem' }}>Total de Consumidoras</span>
            <Users size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{totalCustomers}</div>
          <div style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: '0.25rem' }}>Cadastros orgânicos ativos</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem' }}>LTV Total (Receita Gerada)</span>
            <Award size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>{formatPrice(totalLTV)}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Soma total de conversões</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem' }}>Ticket Médio Geral</span>
            <ShoppingBag size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{formatPrice(avgTicket)}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Por transação individual</div>
        </div>

      </div>

      {/* Listagem de Clientes */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        {customers.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>Nenhum cliente com a tag CUSTOMER registrado.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Cliente</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>E-mail</th>
                  <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>Pedidos Realizados</th>
                  <th style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>Total Gasto (LTV)</th>
                  <th style={{ padding: '1.2rem 1.5rem' }}>Cliente Desde</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((user) => {
                  const userOrdersCount = user.orders.length;
                  const userLTV = user.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      
                      <td style={{ padding: '1.2rem 1.5rem' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {user.name}
                          {userLTV > 400 && (
                            <span style={{ padding: '0.1rem 0.4rem', backgroundColor: 'rgba(229, 203, 179, 0.1)', color: 'var(--accent)', fontSize: '0.7rem', borderRadius: '4px', fontWeight: 'bold' }}>
                              VIP
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {user.id.slice(0, 8)}</div>
                      </td>

                      <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)' }}>
                        {user.email}
                      </td>

                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '99px', 
                          backgroundColor: userOrdersCount > 0 ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-primary)',
                          color: userOrdersCount > 0 ? '#4ade80' : 'var(--text-secondary)',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          {userOrdersCount}
                        </span>
                      </td>

                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right', fontWeight: 'bold', color: userLTV > 0 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {formatPrice(userLTV)}
                      </td>

                      <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {formatDate(user.createdAt)}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
