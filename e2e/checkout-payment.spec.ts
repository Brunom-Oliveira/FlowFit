import { test, expect } from '@playwright/test';

test.describe('Fluxo Crítico: Checkout e Processamento de Pagamento (PCI DSS)', () => {

  test.beforeEach(async ({ page }) => {
    // Intercepta requisições de analytics para não sujar dados de produção
    await page.route('**/analytics/**', route => route.abort());
  });

  test('Deve bloquear pagamento com cartão de crédito fraudulento/recusado e alertar usuário', async ({ page }) => {
    // 1. Setup: Adicionar produto ao carrinho via API para pular navegação visual lenta
    const response = await page.request.post('/api/cart/add', {
      data: { productId: 'test-product-uuid', quantity: 1, size: 'M' }
    });
    expect(response.status()).toBe(200);

    // 2. Navegar direto para o checkout One-Page
    await page.goto('/checkout');
    await expect(page).toHaveTitle(/Finalizar Pedido/);

    // 3. Preencher formulário de identificação e endereço
    await page.fill('input[name="name"]', 'Quality Assurance Test');
    await page.fill('input[name="email"]', 'qa.test@flowfit.com');
    await page.fill('textarea[name="address"]', 'Av. Faria Lima, 3000, SP');

    // 4. Preencher Elemento do Stripe (Iframe Cross-Origin seguro)
    // No Playwright, precisamos focar no frame do Stripe
    const stripeIframe = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    
    // Usando cartão de teste da Stripe para "Declined" (4000 0000 0000 0002)
    await stripeIframe.locator('input[name="cardnumber"]').fill('4000 0000 0000 0002');
    await stripeIframe.locator('input[name="exp-date"]').fill('12/30');
    await stripeIframe.locator('input[name="cvc"]').fill('123');

    // 5. Submeter Transação
    await page.click('button[type="submit"]');

    // 6. Assegurar Feedback Real-time do Antifraude/Adquirente
    // O sistema não deve redirecionar, deve exibir erro inline.
    const errorMessage = page.locator('.text-red-500', { hasText: /Seu cartão foi recusado/i });
    await expect(errorMessage).toBeVisible({ timeout: 10000 });

    // 7. Assegurar que o carrinho NÃO foi limpo após falha
    const cartIconCount = page.locator('[data-testid="cart-badge"]');
    await expect(cartIconCount).toHaveText('1');
  });

  test('Deve aprovar PIX e aguardar Webhook assíncrono', async ({ page }) => {
    await page.goto('/checkout');
    // Mocks e simulações para teste de PIX...
    
    await page.click('button:has-text("Pagar com PIX")');
    await expect(page.locator('canvas#pix-qrcode')).toBeVisible();

    // Dispara webhook falso na API local para simular pagamento
    const webhookRes = await page.request.post('/api/webhooks/mercadopago', {
      data: { type: 'payment', data: { id: 'test_123' } }
    });
    expect(webhookRes.status()).toBe(200);

    // A página de sucesso deve fazer polling ou usar SSE para redirecionar
    await expect(page).toHaveURL(/.*\/checkout\/sucesso/);
  });
});
