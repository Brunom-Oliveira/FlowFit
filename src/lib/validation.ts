import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('E-mail inválido')
    .max(254, 'E-mail muito longo'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .max(128, 'Senha muito longa'),
});

export const checkoutItemSchema = z.object({
  id: z.string().uuid('ID do produto inválido'),
  selectedSize: z.enum(['P', 'M', 'G', 'GG'], {
    message: 'Tamanho inválido',
  }),
  quantity: z
    .number()
    .int('Quantidade deve ser inteiro')
    .min(1, 'Quantidade mínima é 1')
    .max(99, 'Quantidade máxima é 99'),
});

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(120, 'Nome muito longo')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('E-mail inválido')
    .max(254, 'E-mail muito longo'),
  address: z
    .string()
    .trim()
    .min(5, 'Endereço deve ter no mínimo 5 caracteres')
    .max(500, 'Endereço muito longo')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
  items: z
    .array(checkoutItemSchema)
    .min(1, 'Adicione ao menos um item ao carrinho'),
  wantsLoyaltyDiscount: z.boolean().default(false),
});

export const orderStatusSchema = z.enum(
  ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED'],
  { message: 'Status de pedido inválido' }
);

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(200, 'Nome muito longo')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
  description: z
    .string()
    .trim()
    .max(2000, 'Descrição muito longa')
    .transform((v) => v.replace(/<[^>]*>/g, ''))
    .default(''),
  price: z
    .number()
    .positive('Preço deve ser positivo')
    .max(99999.99, 'Preço máximo é R$ 99.999,99'),
  categoryId: z.string().uuid('Categoria inválida'),
  imageURLs: z
    .array(
      z
        .string()
        .url('URL de imagem inválida')
        .max(500, 'URL muito longa')
    )
    .min(1, 'Adicione ao menos uma imagem'),
  stockP: z.number().int().min(0).default(0),
  stockM: z.number().int().min(0).default(0),
  stockG: z.number().int().min(0).default(0),
  stockGG: z.number().int().min(0).default(0),
});

export const productUpdateSchema = productSchema.extend({
  id: z.string().uuid('ID do produto inválido'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
