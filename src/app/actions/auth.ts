"use server";

import { prisma } from '../../lib/prisma';
import { createSession } from '../../lib/session';
import { loginSchema } from '../../lib/validation';
import bcrypt from 'bcryptjs';

export async function login(formData: FormData) {
  const rawEmail = formData.get('email');
  const rawPassword = formData.get('password');

  const parsed = loginSchema.safeParse({
    email: rawEmail ?? undefined,
    password: rawPassword ?? undefined,
  });

  if (!parsed.success) {
    const firstError = (parsed.error as any)?.errors?.[0]?.message || (parsed.error as any)?.issues?.[0]?.message;
    return { error: firstError || 'Dados de login inválidos' };
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: 'Credenciais inválidas' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return { error: 'Credenciais inválidas' };
    }

    await createSession(user.id, user.role);

    return { success: true, role: user.role };
  } catch {
    return { error: 'Erro interno. Tente novamente.' };
  }
}
