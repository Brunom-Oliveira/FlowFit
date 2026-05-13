import { SignJWT, jwtVerify } from 'jose';

// Módulo isomorfo e edge-compatible de JWT usando a biblioteca 'jose'
// Seguro para importação no Next.js Middleware (Edge Runtime)

const getSecretKey = (): Uint8Array => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    return new TextEncoder().encode('dev-fallback-key-32-chars-minimum!!');
  }
  return new TextEncoder().encode(secret);
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
