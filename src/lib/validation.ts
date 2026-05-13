import { z } from 'zod';

// Expressão regular avançada para senhas corporativas seguras (mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('E-mail com formato inválido')
    .max(254, 'E-mail excede o limite de caracteres permitidos')
    .transform((v) => v.replace(/<[^>]*>/g, '')), // Prevenção básica XSS
  password: z
    .string()
    .min(1, 'A senha é obrigatória')
    .max(128, 'Comprimento de senha inválido'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(120, 'O nome excede o limite de caracteres')
    .transform((v) => v.replace(/<[^>]*>/g, '')), // Sanitização estrita
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Forneça um e-mail válido')
    .max(254, 'E-mail excede o limite permitido')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(128, 'A senha excede o limite máximo permitido')
    .refine((val) => passwordRegex.test(val), {
      message: 'A senha deve conter ao menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&)',
    }),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Você deve aceitar os Termos de Uso e a Política de Privacidade (LGPD)',
    }),
});

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('E-mail com formato inválido')
    .max(254, 'E-mail excede o limite de caracteres'),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(10, 'Token de redefinição inválido'),
  newPassword: z
    .string()
    .min(8, 'A nova senha deve ter no mínimo 8 caracteres')
    .max(128, 'A senha excede o limite de caracteres')
    .refine((val) => passwordRegex.test(val), {
      message: 'A senha deve conter ao menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial',
    }),
});

export const mfaVerifySchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, 'O código de autenticação MFA deve conter exatamente 6 dígitos')
    .regex(/^\d+$/, 'O código MFA deve conter apenas números'),
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

// Esquema Corporativo de Coleta Progressiva de Dados (Progressive Profiling)
export const completeProfileSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(10, 'O telefone deve conter o DDD e o número')
    .max(20, 'Telefone muito longo')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
  birthDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Data de nascimento com formato inválido' }),
  addressStreet: z
    .string()
    .trim()
    .min(3, 'O logradouro deve ter no mínimo 3 caracteres')
    .max(200, 'Logradouro muito longo')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
  addressNumber: z
    .string()
    .trim()
    .min(1, 'Número obrigatório')
    .max(20, 'Número muito longo')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
  addressComplement: z
    .string()
    .trim()
    .max(100, 'Complemento excede o limite')
    .transform((v) => v.replace(/<[^>]*>/g, ''))
    .optional(),
  addressNeighborhood: z
    .string()
    .trim()
    .min(2, 'O bairro deve ter no mínimo 2 caracteres')
    .max(100, 'Bairro muito longo')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
  addressCity: z
    .string()
    .trim()
    .min(2, 'A cidade deve ter no mínimo 2 caracteres')
    .max(100, 'Cidade muito longa')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
  addressState: z
    .string()
    .trim()
    .length(2, 'O estado (UF) deve conter exatamente 2 caracteres')
    .transform((v) => v.toUpperCase().replace(/<[^>]*>/g, '')),
  addressZip: z
    .string()
    .trim()
    .min(8, 'CEP inválido')
    .max(10, 'CEP muito longo')
    .transform((v) => v.replace(/<[^>]*>/g, '')),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
