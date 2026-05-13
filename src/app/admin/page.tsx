import { Package, Users, DollarSign, ShoppingBag } from 'lucide-react';
import { prisma } from '../../lib/prisma';

export const revalidate = 0; // Always fresh in admin

export default async function AdminDashboard() {
  // 1. Fetch Total Revenue
  const revenueAggregation = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } }
  });
  const totalRevenue = revenueAggregation._sum.totalAmount ? Number(revenueAggregation._sum.totalAmount) : 0;

  // 2. Fetch Orders Today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersToday = await prisma.order.count({
    where: { createdAt: { gte: today } }
  });

  // 3. Fetch Active Customers
  const customersCount = await prisma.user.count({
    where: { role: 'CUSTOMER' }
  });

  // 4. Fetch Low Stock Items
  const lowStockCount = await prisma.variant.count({
    where: { stock: { lt: 5 } }
  });

  // 5. Fetch Recent Orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  return (
    <div style={{ padding: '3rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Bem-vindo de volta. Aqui está o resumo em tempo real da loja.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline">Relatórios</button>
          <button className="btn btn-primary">+ Novo Produto</button>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Receita Total', value: formatPrice(totalRevenue), icon: <DollarSign size={24} color="var(--accent)" />, trend: 'Em tempo real' },
          { label: 'Pedidos Hoje', value: ordersToday.toString(), icon: <ShoppingBag size={24} color="var(--accent)" />, trend: 'Desde às 00:00' },
          { label: 'Clientes Ativos', value: customersCount.toString(), icon: <Users size={24} color="var(--accent)" />, trend: 'Cadastros gerais' },
          { label: 'Estoque Baixo', value: lowStockCount.toString(), icon: <Package size={24} color={lowStockCount > 0 ? "#ef4444" : "#22c55e"} />, trend: lowStockCount > 0 ? 'Requer atenção' : 'Estoque saudável' },
        ].map((kpi, i) => (
          <div key={i} style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{kpi.label}</p>
                <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)' }}>{kpi.value}</h3>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(229, 203, 179, 0.1)', borderRadius: '8px' }}>
                {kpi.icon}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: kpi.label === 'Estoque Baixo' && kpi.value !== '0' ? '#ef4444' : '#22c55e' }}>{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Pedidos Recentes</h3>
        
        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum pedido realizado ainda.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem 0' }}>Pedido</th>
                  <th style={{ padding: '1rem 0' }}>Cliente</th>
                  <th style={{ padding: '1rem 0' }}>Data</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                  <th style={{ padding: '1rem 0', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1.2rem 0', fontWeight: 'bold' }}>{order.id.slice(0, 8).toUpperCase()}</td>
                    <td style={{ padding: '1.2rem 0' }}>{order.user.name}</td>
                    <td style={{ padding: '1.2rem 0', color: 'var(--text-secondary)' }}>{formatDate(order.createdAt)}</td>
                    <td style={{ padding: '1.2rem 0' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '99px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold',
                        backgroundColor: order.status === 'PAID' ? 'rgba(229, 203, 179, 0.2)' : 
                                       order.status === 'SHIPPED' ? 'rgba(59, 130, 246, 0.2)' : 
                                       order.status === 'DELIVERED' ? 'rgba(34, 197, 94, 0.2)' : 
                                       'rgba(255, 255, 255, 0.1)',
                        color: order.status === 'PAID' ? 'var(--accent)' : 
                               order.status === 'SHIPPED' ? '#60a5fa' : 
                               order.status === 'DELIVERED' ? '#4ade80' : 
                               'var(--text-secondary)'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 0', textAlign: 'right', fontWeight: 'bold' }}>
                      {formatPrice(Number(order.totalAmount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
