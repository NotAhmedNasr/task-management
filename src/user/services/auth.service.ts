import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getTokenForUser(user: object) {
    return user;
  }

  verifyToken(token: string) {
    return token;
  }
}
