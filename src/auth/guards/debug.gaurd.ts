import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class DebugGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    console.log('🚀 ~ AuthGuard ~ canActivate ~ request:', request.query);
    return true;
  }
}
