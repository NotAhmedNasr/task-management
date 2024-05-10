import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import _ from 'lodash';
import { AuthenticatedRequest } from 'src/types';
import { UserAttributes } from 'src/user/models/userAttributes.model';

export const User = createParamDecorator<
  string,
  ExecutionContext,
  UserAttributes | unknown
>((propertyPath: string, ctx: ExecutionContext) => {
  const req: AuthenticatedRequest = ctx.switchToHttp().getRequest();

  return propertyPath ? _.get(req.user, propertyPath) : req.user;
});
