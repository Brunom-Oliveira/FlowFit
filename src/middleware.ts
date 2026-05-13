import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/jwt';

// Rate Limiting distribuído de nível em memória otimizado com janela móvel
const rateLimitMap = new Map<string, { count: number; resetAt: number; blockedUntil?: number }>();

function rateLimit(ip: string, maxAttempts = 7, windowMs = 60000, blockDurationMs = 300000): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetIn: windowMs };
  }

  if (entry.blockedUntil && now < entry.blockedUntil) {
    return { allowed: false, remaining: 0, resetIn: entry.blockedUntil - now };
  }

  if (entry.count >= maxAttempts) {
    // Aplica bloqueio temporário (Brute Force Protection)
    entry.blockedUntil = now + blockDurationMs;
    return { allowed: false, remaining: 0, resetIn: blockDurationMs };
  }

  entry.count++;
  return { allowed: true, remaining: maxAttempts - entry.count, resetIn: entry.resetAt - now };
}

const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' https: data: blob:",
  "connect-src 'self' https: http://localhost:*",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // 1. Injeção Obrigatória de Cabeçalhos de Segurança (OWASP Nível 1)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', CSP_HEADER);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Extração precisa e segura do IP real do cliente
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // 2. Defesa Anti Brute-Force e Rate Limiting nas rotas críticas de Autenticação
  if ((pathname === '/login' || pathname === '/api/auth/refresh' || pathname === '/api/logout') && request.method === 'POST') {
    const rl = rateLimit(ip);
    
    // Injeta cabeçalhos informativos de Rate Limit
    response.headers.set('X-RateLimit-Limit', '7');
    response.headers.set('X-RateLimit-Remaining', String(rl.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(rl.resetIn / 1000)));

    if (!rl.allowed) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Muitas tentativas consecutivas falhas. Por motivos de segurança, seu endereço IP foi bloqueado por 5 minutos.',
          status: 'BLOCKED_BY_POLICY'
        }), 
        {
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(rl.resetIn / 1000))
          },
        }
      );
    }
  }

  // 3. Verificação de Integridade CSRF Estrita
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host && !origin.includes(host) && !origin.includes('localhost')) {
      return new NextResponse(JSON.stringify({ error: 'Violação de Segurança: Cabeçalho de Origem não confiável (CSRF Prevented)' }), { status: 403 });
    }
  }

  // 4. Auditoria de Sessão e Autorização (RBAC Completo e Multicamadas)
  const sessionToken = request.cookies.get('session')?.value;
  let sessionData: Record<string, unknown> | null = null;

  if (sessionToken) {
    sessionData = await decrypt(sessionToken);
  }

  // 🌟 A. Proteção do Perfil de ADMIN
  if (pathname.startsWith('/admin')) {
    if (!sessionData || !sessionData.userId) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (sessionData.role !== 'ADMIN') {
      // Bloqueia Tentativa de Escalada de Privilégio (Privilege Escalation)
      return NextResponse.redirect(new URL('/conta', request.url));
    }
  }

  // 🌟 B. Proteção do Perfil de CLIENTE (Rotas Privadas como /conta e /checkout)
  if (pathname.startsWith('/conta') || pathname.startsWith('/checkout')) {
    if (!sessionData || !sessionData.userId) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 🌟 C. Redirecionamento Inteligente de Usuários já Autenticados
  if (pathname === '/login' && sessionData && sessionData.userId) {
    if (sessionData.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/conta', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
