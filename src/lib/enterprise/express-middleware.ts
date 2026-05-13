/**
 * Middleware Corporativo de Autenticação e RBAC para Node.js com Express
 * Implementação de checagem multicamadas, sanitização e prevenção de injeção
 */

// Mock de interfaces do Express
export interface Request {
  headers: Record<string, string | string[] | undefined>;
  user?: { id: string; role: string; status: string };
  ip?: string;
  [key: string]: any;
}

export interface Response {
  status(code: number): this;
  json(body: any): this;
  setHeader(name: string, value: string): this;
}

export type NextFunction = (err?: any) => void;

// Serviço fictício de JWT para simular verificação no Express
const mockJwtVerify = (token: string): { id: string; role: string; status: string } => {
  if (token === 'expired') throw new Error('TokenExpiredError');
  return { id: 'admin-uuid', role: 'ADMIN', status: 'ACTIVE' };
};

export const requireAuthExpress = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] as string | undefined;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Não autorizado. Token de autenticação Bearer ausente ou malformatado.',
      code: 'AUTH_TOKEN_MISSING'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = mockJwtVerify(token);

    // Verificação de Status da Conta (Prevenção Proativa)
    if (decoded.status !== 'ACTIVE') {
      return res.status(403).json({
        error: 'Sua conta corporativa encontra-se inativa ou suspensa.',
        code: 'ACCOUNT_SUSPENDED'
      });
    }

    // Injeta os dados consolidados do usuário autenticado para as próximas camadas de rotas
    req.user = decoded;
    next();
  } catch (err: any) {
    const isExpired = err.message?.includes('Expired');
    return res.status(isExpired ? 401 : 403).json({
      error: isExpired ? 'Sessão expirada. Solicite um novo token via Refresh Token.' : 'Token de autenticação inválido ou corrompido.',
      code: isExpired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID'
    });
  }
};

// Middleware Factory para validação RBAC baseada em perfis/roles
export const requireRoleExpress = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Falha de identificação de contexto de usuário.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Retorno padronizado de negação de acesso sem expor caminhos ou falhas
      return res.status(403).json({
        error: 'Acesso negado. Sua credencial não possui o nível de privilégio corporativo necessário para este recurso.',
        code: 'INSUFFICIENT_PRIVILEGES'
      });
    }

    next();
  };
};

// Injeção de Segurança Corporativa do padrão OWASP Top 10 para rotas de API
export const securityHeadersExpress = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  next();
};
