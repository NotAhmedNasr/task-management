import { Request } from 'express';
import { UserAttributes } from '../user/models/userAttributes.model';

export interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user: UserAttributes;
}
