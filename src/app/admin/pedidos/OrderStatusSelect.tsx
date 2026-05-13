"use client";

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '../../actions/checkout';

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      setErrorMsg(null);
      const res = await updateOrderStatus(orderId, newStatus as any);
      if (res?.error) {
        setErrorMsg(res.error);
        setTimeout(() => setErrorMsg(null), 3000);
      }
    });
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select 
        value={currentStatus} 
        onChange={handleChange}
        disabled={isPending}
        style={{ 
          padding: '0.25rem 0.5rem', 
          borderRadius: '6px', 
          backgroundColor: currentStatus === 'PAID' ? 'rgba(229, 203, 179, 0.1)' : 
                           currentStatus === 'SHIPPED' ? 'rgba(59, 130, 246, 0.1)' : 
                           currentStatus === 'DELIVERED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)',
          color: currentStatus === 'PAID' ? 'var(--accent)' : 
                 currentStatus === 'SHIPPED' ? '#60a5fa' : 
                 currentStatus === 'DELIVERED' ? '#4ade80' : 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          cursor: isPending ? 'wait' : 'pointer'
        }}
      >
        <option value="PENDING" style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}>Pendente</option>
        <option value="PAID" style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}>Pago</option>
        <option value="SHIPPED" style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}>Enviado</option>
        <option value="DELIVERED" style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}>Entregue</option>
        <option value="CANCELED" style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}>Cancelado</option>
      </select>

      {errorMsg && (
        <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '0.3rem', padding: '0.2rem 0.5rem', backgroundColor: '#ef4444', color: 'white', fontSize: '0.7rem', borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 10, animation: 'fadeIn 0.2s ease' }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
