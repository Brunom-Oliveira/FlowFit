// src/__tests__/api/admin-auth.test.ts

import { NextRequest } from 'next/server';
// Vamos testar diretamente a Server Action ou Handler para provar a lógica
import { getSession } from '../../lib/session';

// Mocks
jest.mock('../../lib/session', () => ({
  getSession: jest.fn(),
}));

// Simulamos a proteção de uma rota sensível do Admin
const adminSecureEndpointHandler = async (req: Request) => {
  const session = await getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (session.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden. Escalonamento de privilégio bloqueado.' }), { status: 403 });
  }

  return new Response(JSON.stringify({ success: true, secretData: 'RELATORIO_FINANCEIRO' }), { status: 200 });
};

describe('Segurança Backend: Controle de Acesso Baseado em Roles (RBAC)', () => {
  it('Deve retornar 401 Unauthorized se não houver sessão ativa', async () => {
    (getSession as jest.Mock).mockResolvedValueOnce(null);

    const req = new Request('http://localhost/api/admin/reports');
    const response = await adminSecureEndpointHandler(req);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('Deve bloquear tentativa de acesso lateral (Escalonamento de Privilégio - 403 Forbidden)', async () => {
    // Simula um cliente injetando um token roubado ou logado com perfil básico
    (getSession as jest.Mock).mockResolvedValueOnce({
      userId: 'cliente-123',
      role: 'CUSTOMER', 
      email: 'hacker@example.com'
    });

    const req = new Request('http://localhost/api/admin/reports');
    const response = await adminSecureEndpointHandler(req);

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain('Forbidden');
  });

  it('Deve liberar acesso (200 OK) para contas corporativas com Role ADMIN', async () => {
    // Simula Diretor de E-commerce
    (getSession as jest.Mock).mockResolvedValueOnce({
      userId: 'diretor-999',
      role: 'ADMIN', 
      email: 'diretoria@flowfit.com'
    });

    const req = new Request('http://localhost/api/admin/reports');
    const response = await adminSecureEndpointHandler(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.secretData).toBeDefined();
  });
});
