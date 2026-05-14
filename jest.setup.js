import '@testing-library/jest-dom';

// Mocks globais para uso do Next.js App Router em Testes Unitários
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));

// Mock do Prisma globalmente para não sujar o banco em testes unitários
jest.mock('./src/lib/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    order: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    transaction: { update: jest.fn() },
    webhookEvent: { findUnique: jest.fn(), upsert: jest.fn() },
    $transaction: jest.fn((callback) => callback(require('./src/lib/prisma').prisma)),
  }
}));
