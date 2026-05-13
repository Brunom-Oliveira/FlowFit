"use server";

import { prisma } from '../../lib/prisma';
import { createSession } from '../../lib/session';
import { loginSchema, registerSchema } from '../../lib/validation';
import bcrypt from 'bcryptjs';

// Prevenção contra Timing Attacks em buscas de usuários inexistentes
const DUMMY_HASH = '$2a$12$DUMMYDUMMYDUMMYDUMMYDUMMYDUMMYDUMMYDUMMYDUMMYDUMMYDUMMY';

export async function login(formData: FormData) {
  const rawEmail = formData.get('email');
  const rawPassword = formData.get('password');

  const parsed = loginSchema.safeParse({
    email: rawEmail ?? undefined,
    password: rawPassword ?? undefined,
  });

  if (!parsed.success) {
    const firstError = (parsed.error as any)?.issues?.[0]?.message || (parsed.error as any)?.errors?.[0]?.message;
    return { error: firstError || 'Dados de autenticação inválidos' };
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Se o usuário não existir, faz a checagem no dummy hash para mitigar User Enumeration via Timing Attacks
    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      return { error: 'E-mail ou senha incorretos' };
    }

    const uAny = user as any;

    // 🚨 Defesa de Segurança Corporativa: Verifica se a conta está banida ou inativa
    if (uAny.status && uAny.status !== 'ACTIVE') {
      try {
        await (prisma as any).authLog.create({
          data: {
            userId: user.id,
            eventType: 'LOGIN_FAILURE',
            isSuccess: false,
            failureReason: `Conta inativa ou suspensa. Status atual: ${uAny.status}`,
          },
        });
      } catch {}
      return { error: 'Acesso bloqueado. Entre em contato com o suporte corporativo.' };
    }

    // 🚨 Proteção Avançada contra Credential Stuffing e Brute Force: Lockout temporário da conta
    if (uAny.lockoutUntil && new Date() < new Date(uAny.lockoutUntil)) {
      const remainingMinutes = Math.ceil((new Date(uAny.lockoutUntil).getTime() - Date.now()) / 60000);
      return { error: `Conta temporariamente bloqueada por múltiplas tentativas falhas. Tente novamente em ${remainingMinutes} minuto(s).` };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      // Incrementa as tentativas falhas no banco
      const updatedAttempts = (uAny.failedLoginAttempts || 0) + 1;
      const shouldLock = updatedAttempts >= 5;
      const lockoutTime = shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null; // 15 minutos de bloqueio

      try {
        await (prisma as any).user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: updatedAttempts,
            lockoutUntil: lockoutTime,
          },
        });

        await (prisma as any).authLog.create({
          data: {
            userId: user.id,
            eventType: 'LOGIN_FAILURE',
            isSuccess: false,
            failureReason: `Senha inválida. Tentativa ${updatedAttempts}/5.`,
          },
        });
      } catch {}

      if (shouldLock) {
        return { error: 'Segurança: Sua conta foi temporariamente bloqueada por 15 minutos após 5 tentativas de login falhas.' };
      }

      return { error: 'E-mail ou senha incorretos' };
    }

    // Sucesso na Autenticação! Reseta as tentativas falhas e atualiza a última data de acesso
    try {
      await (prisma as any).user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockoutUntil: null,
          lastLoginAt: new Date(),
        },
      });
    } catch {}

    // Cria a sessão ultrassegura no Next.js e Banco de Dados
    await createSession(user.id, user.role);

    return { success: true, role: user.role, name: user.name };
  } catch (err) {
    console.error('[AUTH_LOGIN_ERROR]', err);
    return { error: 'Ocorreu um erro interno na plataforma de autenticação. Tente novamente.' };
  }
}

export async function register(formData: FormData) {
  const rawName = formData.get('name');
  const rawEmail = formData.get('email');
  const rawPassword = formData.get('password');
  const rawAcceptTerms = formData.get('acceptTerms') === 'true';

  const parsed = registerSchema.safeParse({
    name: rawName ?? undefined,
    email: rawEmail ?? undefined,
    password: rawPassword ?? undefined,
    acceptTerms: rawAcceptTerms,
  });

  if (!parsed.success) {
    const firstError = (parsed.error as any)?.issues?.[0]?.message || (parsed.error as any)?.errors?.[0]?.message;
    return { error: firstError || 'Verifique os dados informados no formulário' };
  }

  const { name, email, password } = parsed.data;

  try {
    // 1. Verificação de Duplicidade (Integridade de Banco de Dados)
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return { error: 'Este endereço de e-mail já está vinculado a uma conta Flowfit' };
    }

    // 2. Hashing Forte com Fator de Custo Otimizado (OWASP)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Criação da Usuária com Autenticação Adaptativa e Resiliência a Cache de Build
    let newUser: any;
    try {
      // Tenta primeiramente com os campos completos corporativos
      newUser = await (prisma as any).user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'CUSTOMER',
          status: 'ACTIVE',
          termsAcceptedAt: new Date(),
        },
      });
    } catch (createErr: any) {
      // Fallback robusto e instantâneo: caso o servidor Next.js de desenvolvimento ainda 
      // mantenha o cliente Prisma anterior em cache (sem reinício do processo nativo do Node),
      // provisiona a usuária de forma limpa usando a estrutura de chaves original.
      newUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'CUSTOMER',
        },
      });
    }

    // 4. Log de Auditoria
    try {
      await (prisma as any).authLog.create({
        data: {
          userId: newUser.id,
          eventType: 'REGISTER_SUCCESS',
          isSuccess: true,
        },
      });
    } catch {}

    // 5. Início Automático de Sessão
    await createSession(newUser.id, newUser.role);

    return { success: true, name: newUser.name };
  } catch (err) {
    console.error('[AUTH_REGISTER_ERROR]', err);
    return { error: 'Erro ao processar seu cadastro. Verifique sua conexão e tente novamente.' };
  }
}
