import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';
import crypto from 'crypto';

const getSecretKey = (): Uint8Array => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    return new TextEncoder().encode('dev-fallback-key-32-chars-minimum!!');
  }
  return new TextEncoder().encode(secret);
};

const key = getSecretKey();

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: string, ipAddress?: string, userAgent?: string) {
  const sessionId = crypto.randomUUID();
  const expiresAccess = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const expiresRefresh = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const sessionToken = await encrypt({ sessionId, userId, role, expires: expiresAccess });
  
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const refreshTokenHash = hashToken(refreshToken);

  try {
    await (prisma as any).session.create({
      data: {
        id: sessionId,
        userId,
        refreshTokenHash,
        expiresAt: expiresRefresh,
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown',
      },
    });

    await (prisma as any).authLog.create({
      data: {
        userId,
        eventType: 'LOGIN_SUCCESS',
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown',
        isSuccess: true,
      },
    });
  } catch (err) {
    console.error('[SECURITY_DB_ERROR]', err);
  }

  const cookieStore = await cookies();
  
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAccess,
    sameSite: 'strict',
    path: '/',
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    expires: expiresRefresh,
    sameSite: 'strict',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (sessionCookie?.value) {
    const payload = await decrypt(sessionCookie.value);
    if (payload && payload.sessionId) {
      try {
        await (prisma as any).session.updateMany({
          where: { id: String(payload.sessionId) },
          data: { isRevoked: true },
        });

        if (payload.userId) {
          await (prisma as any).authLog.create({
            data: {
              userId: String(payload.userId),
              eventType: 'LOGOUT',
              isSuccess: true,
            },
          });
        }
      } catch {}
    }
  }

  cookieStore.delete('session');
  cookieStore.delete('refresh_token');
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie?.value) return null;

  const payload = await decrypt(sessionCookie.value);
  if (!payload) return null;

  if (payload.sessionId) {
    try {
      const dbSession = await (prisma as any).session.findUnique({
        where: { id: String(payload.sessionId) },
        select: { isRevoked: true, expiresAt: true },
      });
      
      if (!dbSession || dbSession.isRevoked || new Date() > new Date(dbSession.expiresAt)) {
        return null;
      }
    } catch {}
  }

  return payload;
}

export async function rotateSessionToken(oldRefreshToken: string, ipAddress?: string, userAgent?: string) {
  const oldHash = hashToken(oldRefreshToken);
  
  try {
    const session = await (prisma as any).session.findUnique({
      where: { refreshTokenHash: oldHash },
      include: { user: true },
    });

    if (!session) {
      return { error: 'Token de atualização inválido ou inexistente' };
    }

    if (session.isRevoked) {
      await (prisma as any).session.updateMany({
        where: { userId: session.userId },
        data: { isRevoked: true },
      });

      await (prisma as any).authLog.create({
        data: {
          userId: session.userId,
          eventType: 'TOKEN_REFRESH',
          isSuccess: false,
          failureReason: 'Replay Attack Detectado: Reutilização de Refresh Token Revogado.',
          ipAddress,
          userAgent,
        },
      });

      return { error: 'Alerta de Segurança: Tentativa de reutilização de token. Acesso bloqueado.' };
    }

    if (new Date() > new Date(session.expiresAt)) {
      return { error: 'Sessão expirada. Faça login novamente.' };
    }

    await (prisma as any).session.update({
      where: { id: session.id },
      data: { isRevoked: true },
    });

    await createSession(session.userId, session.user?.role || 'CUSTOMER', ipAddress, userAgent);

    await (prisma as any).authLog.create({
      data: {
        userId: session.userId,
        eventType: 'TOKEN_REFRESH',
        isSuccess: true,
        ipAddress,
        userAgent,
      },
    });

    return { success: true };
  } catch (err) {
    return { error: 'Erro interno durante a rotação de tokens' };
  }
}
