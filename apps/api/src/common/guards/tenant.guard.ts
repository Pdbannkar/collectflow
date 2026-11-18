import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;
    const paramBizId = req.params?.businessId;
    if (paramBizId && user.businessId && paramBizId !== user.businessId) {
      throw new ForbiddenException('Cross-tenant access not permitted');
    }
    if (user.businessId) req.businessId = user.businessId;
    return true;
  }
}
