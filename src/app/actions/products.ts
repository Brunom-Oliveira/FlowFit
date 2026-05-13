"use server";

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '../../lib/session';
import { productSchema, productUpdateSchema } from '../../lib/validation';
import { z } from 'zod';

function extractImages(formData: FormData): string[] {
  const urls: string[] = [];
  formData.forEach((value, key) => {
    if (key.startsWith('image_') && typeof value === 'string' && value.trim() !== '') {
      urls.push(value.trim());
    }
  });
  return urls;
}

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Não autorizado');
  }
  return session;
}

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function createProduct(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    return { error: 'Não autorizado. Acesso negado.' };
  }

  const imageURLs = extractImages(formData);

  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : undefined,
    categoryId: formData.get('categoryId'),
    imageURLs,
    stockP: parseInt(formData.get('stock_P') as string) || 0,
    stockM: parseInt(formData.get('stock_M') as string) || 0,
    stockG: parseInt(formData.get('stock_G') as string) || 0,
    stockGG: parseInt(formData.get('stock_GG') as string) || 0,
  });

  if (!parsed.success) {
    const firstError = (parsed.error as any)?.errors?.[0]?.message || (parsed.error as any)?.issues?.[0]?.message;
    return { error: firstError || 'Dados do produto inválidos' };
  }

  const { name, description, price, categoryId, imageURLs: imgs, stockP, stockM, stockG, stockGG } = parsed.data;
  const slug = slugify(name);

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: { name, slug, description, price, categoryId },
      });

      await Promise.all(
        imgs.map((url) =>
          tx.image.create({ data: { url, productId: product.id } })
        )
      );

      const variants = [
        { size: 'P' as const, stock: stockP, sku: `${slug}-P` },
        { size: 'M' as const, stock: stockM, sku: `${slug}-M` },
        { size: 'G' as const, stock: stockG, sku: `${slug}-G` },
        { size: 'GG' as const, stock: stockGG, sku: `${slug}-GG` },
      ];

      await Promise.all(
        variants.map((v) =>
          tx.variant.create({
            data: { productId: product.id, size: v.size, color: 'Padrão', stock: v.stock, sku: v.sku },
          })
        )
      );
    });
  } catch (error) {
    console.error('[createProduct]', error);
    return { error: 'Erro ao cadastrar produto.' };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/produtos');
  revalidatePath('/shop');
  redirect('/admin/produtos');
}

export async function updateProduct(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    return { error: 'Não autorizado. Acesso negado.' };
  }

  const imageURLs = extractImages(formData);

  const parsed = productUpdateSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : undefined,
    categoryId: formData.get('categoryId'),
    imageURLs,
    stockP: parseInt(formData.get('stock_P') as string) || 0,
    stockM: parseInt(formData.get('stock_M') as string) || 0,
    stockG: parseInt(formData.get('stock_G') as string) || 0,
    stockGG: parseInt(formData.get('stock_GG') as string) || 0,
  });

  if (!parsed.success) {
    const firstError = (parsed.error as any)?.errors?.[0]?.message || (parsed.error as any)?.issues?.[0]?.message;
    return { error: firstError || 'Dados do produto inválidos' };
  }

  const { id, name, description, price, categoryId, imageURLs: imgs, stockP, stockM, stockG, stockGG } = parsed.data;
  const slug = slugify(name);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: { name, slug, description, price, categoryId },
      });

      await tx.image.deleteMany({ where: { productId: id } });
      await Promise.all(
        imgs.map((url) =>
          tx.image.create({ data: { url, productId: id } })
        )
      );

      const stockMap: Record<string, number> = { P: stockP, M: stockM, G: stockG, GG: stockGG };
      const existingVariants = await tx.variant.findMany({ where: { productId: id } });

      for (const variant of existingVariants) {
        const newStock = stockMap[variant.size] ?? variant.stock;
        await tx.variant.update({
          where: { id: variant.id },
          data: { stock: newStock },
        });
      }
    });
  } catch (error) {
    console.error('[updateProduct]', error);
    return { error: 'Erro ao atualizar produto.' };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/produtos');
  revalidatePath('/shop');
  redirect('/admin/produtos');
}

export async function deleteProduct(productId: string) {
  try {
    await requireAdmin();
  } catch {
    return { error: 'Não autorizado. Acesso negado.' };
  }

  const parsed = z.string().uuid('ID do produto inválido').safeParse(productId);
  if (!parsed.success) {
    return { error: 'ID do produto inválido' };
  }

  try {
    await prisma.product.delete({ where: { id: parsed.data } });
    revalidatePath('/admin');
    revalidatePath('/admin/produtos');
    revalidatePath('/shop');
    return { success: true };
  } catch {
    return { error: 'Erro ao deletar o produto.' };
  }
}
