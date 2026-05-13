/**
 * Exemplo Corporativo de AuthGuard e RolesGuard para o NestJS Framework
 * Implementação limpa e tipada para controle de autorização baseado em RBAC
 */

// Mock de Tipagens do NestJS para validação e compilação limpa no ambiente do projeto
export interface ExecutionContext {
  switchToHttp(): {
    getRequest(): any;
    getResponse(): any;
  };
  getHandler(): any;
  getClass(): any;
}

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}

// Decorator customizado para injeção de Roles permitidas nas rotas
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    // Injeção de metadados conceitual
  };
};

export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false; // Retorna 401 Unauthorized automaticamente no NestJS
    }

    const token = authHeader.split(' ')[1];

    try {
      // Em um projeto real NestJS usaríamos o JwtService injetado
      // Exemplo: const payload = await this.jwtService.verifyAsync(token);
      
      // Anexa os dados da sessão ao objeto request global
      request.user = { userId: 'user-uuid', role: 'ADMIN', status: 'ACTIVE' };
      
      // Defesa em profundidade: checagem de bloqueio
      if (request.user.status !== 'ACTIVE') {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

export class RolesGuard implements CanActivate {
  constructor(private reflector: any) {}

  canActivate(context: ExecutionContext): boolean {
    // Extrai as roles requeridas dos metadados anexados ao Controller ou Endpoint
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Se a rota não exige roles específicas, permite o tráfego
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      return false; // 403 Forbidden
    }

    // Valida estritamente se o usuário logado possui a Role requerida
    return requiredRoles.includes(user.role);
  }
}
