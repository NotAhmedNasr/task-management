import { Request } from 'express';
import { UserAttributes } from './user/models/userAttributes.model';

export interface AuthenticatedRequest extends Request {
  user: UserAttributes;
}
