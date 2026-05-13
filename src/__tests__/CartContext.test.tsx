/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import { ReactNode } from 'react';

const mockProduct = {
  id: '1',
  name: 'Legging Test',
  price: 149.9,
  priceFormatted: 'R$ 149,90',
  category: 'Leggings',
  image: 'https://example.com/img.jpg',
  description: 'Test',
  sizes: ['P', 'M', 'G'],
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext - Estado Global do Carrinho', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Deve iniciar com carrinho vazio', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

  test('Deve adicionar item ao carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cartCount).toBe(1);
  });

  test('Deve incrementar quantidade ao adicionar item duplicado', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cartCount).toBe(2);
  });

  test('Deve remover item do carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.removeFromCart('1'));
    expect(result.current.cart).toHaveLength(0);
  });

  test('Deve atualizar quantidade', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.updateQuantity('1', 5));
    expect(result.current.cart[0].quantity).toBe(5);
  });

  test('Deve limpar carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.clearCart());
    expect(result.current.cart).toHaveLength(0);
  });

  test('Deve calcular total corretamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(mockProduct));
    act(() => result.current.addToCart(mockProduct));
    expect(result.current.cartTotal).toBe(149.9 * 2);
  });
});
