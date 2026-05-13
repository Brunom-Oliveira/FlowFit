import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { CheckoutInput } from '../lib/validation';

export interface CheckoutResultDTO {
  success: boolean;
  orderId?: string;
  error?: string;
}

export class CheckoutService {

  static async executeOrder(payload: CheckoutInput): Promise<CheckoutResultDTO> {
    const { name, email, address, items, wantsLoyaltyDiscount } = payload;

    try {
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        const guestHash = await bcrypt.hash(
          `guest-${email}-${Date.now()}`,
          await bcrypt.genSalt(10)
        );

        user = await prisma.user.create({
          data: {
            email,
            name,
            passwordHash: guestHash,
            role: Role.CUSTOMER,
            loyaltyPoints: 10,
          },
        });
      }

      const persistentUser = user;

      const orderId = await prisma.$transaction(async (tx) => {
        let baseTotalAmount = 0;
        const orderItemsData: Array<{ variantId: string; quantity: number; price: number }> = [];

        for (const item of items) {
          const product = await tx.product.findUnique({ where: { id: item.id } });

          if (!product) {
            throw new Error('Produto não encontrado');
          }

          const variant = await tx.variant.findFirst({
            where: { productId: product.id, size: item.selectedSize as any },
          });

          if (!variant || variant.stock < item.quantity) {
            throw new Error('Estoque insuficiente');
          }

          await tx.variant.update({
            where: { id: variant.id },
            data: { stock: variant.stock - item.quantity },
          });

          baseTotalAmount += Number(product.price) * item.quantity;

          orderItemsData.push({
            variantId: variant.id,
            quantity: item.quantity,
            price: Number(product.price),
          });
        }

        let appliedDiscount = 0;
        if (wantsLoyaltyDiscount) {
          if (persistentUser.loyaltyPoints >= 150) {
            appliedDiscount = 15.0;
            await tx.user.update({
              where: { id: persistentUser.id },
              data: { loyaltyPoints: persistentUser.loyaltyPoints - 150 },
            });
          } else {
            throw new Error('FLOWVIP: saldo de pontos insuficiente');
          }
        }

        const finalTotalAmount = Math.max(0, baseTotalAmount - appliedDiscount);

        const order = await tx.order.create({
          data: {
            userId: persistentUser.id,
            status: 'PAID',
            totalAmount: finalTotalAmount,
            shippingAddress: address,
            items: { create: orderItemsData },
          } as any,
        });

        const pointsEarned = Math.floor(finalTotalAmount / 10);
        await tx.user.update({
          where: { id: persistentUser.id },
          data: { loyaltyPoints: { increment: pointsEarned } },
        });

        return order.id;
      });

      return { success: true, orderId };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro interno ao processar pedido';
      console.error('[CheckoutService]', message);
      return { success: false, error: message };
    }
  }
}
