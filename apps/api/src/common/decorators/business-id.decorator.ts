import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const BusinessId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return req.businessId || req.user?.businessId;
  },
);
