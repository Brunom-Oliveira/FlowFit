// src/__tests__/loyalty-cashback.test.ts

// Mock de uma função simulada de regra de negócios para Cashback
// Na arquitetura real isso viria de src/app/actions/cashback.ts
const calculateRedeemableAmount = (userBalance: number, cartTotal: number): number => {
  if (userBalance <= 0) return 0;
  
  // Regra Enterprise: O Cashback não pode abater mais de 50% do total da compra
  const maxAllowedDiscount = cartTotal * 0.5;
  
  if (userBalance > maxAllowedDiscount) {
    return maxAllowedDiscount;
  }
  return userBalance;
};

describe('Módulo de Regras de Negócio: Cashback & Fidelidade', () => {

  it('Deve resgatar todo o saldo se for menor que 50% do carrinho', () => {
    const balance = 35.00; // R$35
    const cartTotal = 200.00; // 50% é R$100
    
    const appliedDiscount = calculateRedeemableAmount(balance, cartTotal);
    expect(appliedDiscount).toBe(35.00);
  });

  it('Deve limitar o resgate a 50% do valor total do carrinho', () => {
    const balance = 150.00; 
    const cartTotal = 200.00; // 50% é R$100
    
    const appliedDiscount = calculateRedeemableAmount(balance, cartTotal);
    expect(appliedDiscount).toBe(100.00); // Bloqueia nos R$100
  });

  it('Deve retornar 0 se o saldo do usuário for zero ou negativo', () => {
    const appliedDiscount = calculateRedeemableAmount(0, 500);
    expect(appliedDiscount).toBe(0);

    const appliedDiscountNegative = calculateRedeemableAmount(-10, 500);
    expect(appliedDiscountNegative).toBe(0);
  });

  it('Deve limitar o desconto a zero se o carrinho for gratuito (R$0)', () => {
    const appliedDiscount = calculateRedeemableAmount(50, 0);
    expect(appliedDiscount).toBe(0);
  });

});
