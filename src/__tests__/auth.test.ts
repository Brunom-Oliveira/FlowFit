import { login } from '../app/actions/auth';

jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../lib/session', () => ({
  createSession: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

const prismaMock = jest.requireMock('../lib/prisma').prisma;
const bcryptMock = jest.requireMock('bcryptjs');
const sessionMock = jest.requireMock('../lib/session');

describe('Auth - Server Actions de Autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve rejeitar login sem email', async () => {
    const form = new FormData();
    form.set('password', '123');
    const result = await login(form);
    expect(result.error).toBeDefined();
  });

  test('Deve rejeitar login sem senha', async () => {
    const form = new FormData();
    form.set('email', 'test@test.com');
    const result = await login(form);
    expect(result.error).toBeDefined();
  });

  test('Deve rejeitar login com usuário inexistente', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const form = new FormData();
    form.set('email', 'naoexiste@test.com');
    form.set('password', '123');
    const result = await login(form);
    expect(result.error).toBeDefined();
  });

  test('Deve autenticar admin com credenciais válidas', async () => {
    const mockUser = {
      id: 'admin-1',
      email: 'admin@flowfit.com',
      passwordHash: '$2a$10$hashedpassword',
      role: 'ADMIN',
      name: 'Admin',
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    bcryptMock.compare.mockResolvedValue(true);

    const form = new FormData();
    form.set('email', 'admin@flowfit.com');
    form.set('password', 'admin123');
    const result = await login(form);
    expect(result.success).toBe(true);
    expect(result.role).toBe('ADMIN');
    expect(sessionMock.createSession).toHaveBeenCalledWith('admin-1', 'ADMIN');
  });

  test('Deve rejeitar senha incorreta', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'user@test.com',
      passwordHash: '$2a$10$hashed',
      role: 'CUSTOMER',
      name: 'User',
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    bcryptMock.compare.mockResolvedValue(false);

    const form = new FormData();
    form.set('email', 'user@test.com');
    form.set('password', 'wrongpass');
    const result = await login(form);
    expect(result.error).toBeDefined();
  });
});
