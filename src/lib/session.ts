import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const getSecretKey = (): Uint8Array => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set with at least 32 characters in production');
    }
    console.warn('[SECURITY] Using fallback JWT secret in development only');
  }
  return new TextEncoder().encode(secret || 'dev-fallback-key-32-chars-minimum!!');
};

const key = getSecretKey();

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

export async function createSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const sessionToken = await encrypt({ userId, role, expires });

  const cookieStore = await cookies();
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'strict',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie?.value) return null;

  return await decrypt(sessionCookie.value);
}
