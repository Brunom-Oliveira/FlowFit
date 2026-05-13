import { getProducts, getProductById } from '../lib/products';

jest.mock('../lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const prismaMock = jest.requireMock('../lib/prisma').prisma;

describe('Products - Camada de Dados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve retornar lista vazia quando não há produtos', async () => {
    prismaMock.product.findMany.mockResolvedValue([]);
    const products = await getProducts();
    expect(products).toEqual([]);
  });

  test('Deve mapear corretamente os produtos', async () => {
    const dbProduct = {
      id: '1',
      name: 'Legging Test',
      description: 'Descrição test',
      price: 149.9,
      slug: 'legging-test',
      categoryId: 'cat-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      category: { id: 'cat-1', name: 'Leggings', slug: 'leggings', createdAt: new Date(), updatedAt: new Date() },
      variants: [{ id: 'v1', productId: '1', size: 'M', color: 'Preto', stock: 10, sku: 'LEG-M', orderItems: [] }],
      images: [{ id: 'i1', url: 'https://example.com/img.jpg', productId: '1' }],
      wishlistedBy: [],
    };

    prismaMock.product.findMany.mockResolvedValue([dbProduct]);
    const products = await getProducts();

    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Legging Test');
    expect(products[0].priceFormatted).toContain('149,90');
    expect(products[0].sizes).toContain('M');
  });

  test('Deve retornar null para produto inexistente', async () => {
    prismaMock.product.findFirst.mockResolvedValue(null);
    const product = await getProductById('fake-id');
    expect(product).toBeNull();
  });
});
