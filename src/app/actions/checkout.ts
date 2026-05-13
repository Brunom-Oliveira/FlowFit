"use server";

import { revalidatePath } from 'next/cache';
import { getSession } from '../../lib/session';
import { CheckoutService } from '../../services/CheckoutService';
import { checkoutSchema, orderStatusSchema } from '../../lib/validation';
import { prisma } from '../../lib/prisma';

export async function processCheckout(formData: FormData) {
  const rawName = formData.get('name');
  const rawEmail = formData.get('email');
  const rawAddress = formData.get('address');
  const itemsJson = formData.get('items');
  const rawDiscount = formData.get('discountValue');

  if (!itemsJson || typeof itemsJson !== 'string') {
    return { error: 'Itens do carrinho não encontrados' };
  }

  let items: unknown;
  try {
    items = JSON.parse(itemsJson);
  } catch {
    return { error: 'Formato de itens inválido' };
  }

  const parsed = checkoutSchema.safeParse({
    name: rawName,
    email: rawEmail,
    address: rawAddress,
    items,
    wantsLoyaltyDiscount: rawDiscount ? true : false,
  });

  if (!parsed.success) {
    const firstError = (parsed.error as any)?.errors?.[0]?.message || (parsed.error as any)?.issues?.[0]?.message;
    return { error: firstError || 'Dados de checkout inválidos' };
  }

  try {
    const result = await CheckoutService.executeOrder(parsed.data);

    if (!result.success) {
      return { error: result.error };
    }

    revalidatePath('/admin');
    revalidatePath('/admin/pedidos');
    revalidatePath('/admin/produtos');
    revalidatePath('/admin/clientes');
    revalidatePath('/shop');

    return { success: true, orderId: result.orderId };
  } catch (error) {
    console.error('[CheckoutAction]', error);
    return { error: 'Erro ao processar pedido. Tente novamente.' };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Não autorizado. Acesso restrito a administradores.' };
  }

  const parsedStatus = orderStatusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { error: 'Status de pedido inválido' };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: parsedStatus.data },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/pedidos');
    return { success: true };
  } catch {
    return { error: 'Erro ao atualizar status do pedido.' };
  }
}
