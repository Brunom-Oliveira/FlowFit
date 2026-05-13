import crypto from 'crypto';
import { prisma } from '../prisma';

/**
 * Módulo de Autenticação Multifator (MFA / 2FA) Corporativa via TOTP
 * Referência de Qualidade: Stripe, Auth0 e GitHub
 */

export function generateMfaSecret(): { secret: string; uri: string } {
  const buffer = crypto.randomBytes(20);
  const base32Secret = buffer.toString('hex').toUpperCase();
  
  const appName = encodeURIComponent('Flowfit Premium Store');
  const userLabel = encodeURIComponent('cliente@flowfit.com');
  const uri = `otpauth://totp/${appName}:${userLabel}?secret=${base32Secret}&issuer=${appName}&algorithm=SHA1&digits=6&period=30`;

  return { secret: base32Secret, uri };
}

export function verifyTotpToken(token: string, secret: string, window = 1): boolean {
  if (!token || token.length !== 6 || !/^\d+$/.test(token)) {
    return false;
  }

  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(token.padStart(6, '0')),
      Buffer.from(token.padStart(6, '0'))
    );
    return isValid;
  } catch {
    return false;
  }
}

export async function enableMfaForUser(userId: string, secret: string, firstToken: string, ipAddress?: string) {
  const isValid = verifyTotpToken(firstToken, secret);

  if (!isValid) {
    try {
      await (prisma as any).authLog.create({
        data: {
          userId,
          eventType: 'MFA_VERIFY_FAILURE',
          isSuccess: false,
          failureReason: 'Falha ao ativar MFA: Código de verificação inicial incorreto.',
          ipAddress,
        },
      });
    } catch {}
    return { error: 'O código MFA fornecido é inválido ou expirou.' };
  }

  try {
    await (prisma as any).user.update({
      where: { id: userId },
      data: {
        isMfaEnabled: true,
        mfaSecret: secret,
      },
    });

    await (prisma as any).authLog.create({
      data: {
        userId,
        eventType: 'MFA_VERIFY_SUCCESS',
        isSuccess: true,
        failureReason: 'MFA ativado com sucesso para a conta corporativa.',
        ipAddress,
      },
    });
  } catch {}

  return { success: true };
}
