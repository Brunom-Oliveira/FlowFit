import { checkoutSchema, loginSchema, productSchema } from '../lib/validation';

describe('Zod Validation Schemas', () => {
  describe('loginSchema', () => {
    test('deve aceitar credenciais válidas', () => {
      const result = loginSchema.safeParse({ email: 'user@test.com', password: '123456' });
      expect(result.success).toBe(true);
    });

    test('deve rejeitar email inválido', () => {
      const result = loginSchema.safeParse({ email: 'invalido', password: '123456' });
      expect(result.success).toBe(false);
    });

    test('deve rejeitar senha vazia', () => {
      const result = loginSchema.safeParse({ email: 'user@test.com', password: '' });
      expect(result.success).toBe(false);
    });

    test('deve trim e lowercase o email', () => {
      const result = loginSchema.safeParse({ email: '  User@Test.COM  ', password: '123' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@test.com');
      }
    });
  });

  describe('checkoutSchema', () => {
    const validPayload = {
      name: 'Amanda Silva',
      email: 'amanda@test.com',
      address: 'Av Paulista, 1000 - São Paulo/SP',
      items: [{ id: '550e8400-e29b-41d4-a716-446655440000', selectedSize: 'M', quantity: 1 }],
      wantsLoyaltyDiscount: false,
    };

    test('deve aceitar payload válido', () => {
      const result = checkoutSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    test('deve rejeitar carrinho vazio', () => {
      const result = checkoutSchema.safeParse({ ...validPayload, items: [] });
      expect(result.success).toBe(false);
    });

    test('deve rejeitar nome vazio', () => {
      const result = checkoutSchema.safeParse({ ...validPayload, name: '' });
      expect(result.success).toBe(false);
    });

    test('deve rejeitar quantidade zero', () => {
      const result = checkoutSchema.safeParse({
        ...validPayload,
        items: [{ id: '550e8400-e29b-41d4-a716-446655440000', selectedSize: 'M', quantity: 0 }],
      });
      expect(result.success).toBe(false);
    });

    test('deve rejeitar tamanho inválido', () => {
      const result = checkoutSchema.safeParse({
        ...validPayload,
        items: [{ id: '550e8400-e29b-41d4-a716-446655440000', selectedSize: 'XG', quantity: 1 }],
      });
      expect(result.success).toBe(false);
    });

    test('deve sanitizar XSS em name e address', () => {
      const result = checkoutSchema.safeParse({
        ...validPayload,
        name: 'Amanda <script>alert("xss")</script>',
        address: 'Rua <img src=x onerror=alert(1)>',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).not.toContain('<script>');
        expect(result.data.address).not.toContain('<img');
      }
    });
  });

  describe('productSchema', () => {
    test('deve aceitar produto válido', () => {
      const result = productSchema.safeParse({
        name: 'Legging Premium',
        description: 'Legging de alta compressão',
        price: 149.9,
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        imageURLs: ['https://images.unsplash.com/photo-test'],
        stockP: 10,
        stockM: 15,
        stockG: 5,
        stockGG: 0,
      });
      expect(result.success).toBe(true);
    });

    test('deve rejeitar preço negativo', () => {
      const result = productSchema.safeParse({
        name: 'Legging',
        description: '',
        price: -10,
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        imageURLs: ['https://images.unsplash.com/photo-test'],
      });
      expect(result.success).toBe(false);
    });

    test('deve rejeitar nome muito curto', () => {
      const result = productSchema.safeParse({
        name: 'A',
        description: '',
        price: 100,
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        imageURLs: ['https://images.unsplash.com/photo-test'],
      });
      expect(result.success).toBe(false);
    });

    test('deve rejeitar array de imagens vazio', () => {
      const result = productSchema.safeParse({
        name: 'Legging',
        description: '',
        price: 100,
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        imageURLs: [],
      });
      expect(result.success).toBe(false);
    });
  });
});
