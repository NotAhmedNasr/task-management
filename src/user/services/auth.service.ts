import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAttributes } from '../models/userAttributes.model';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  getTokenForUser(user: UserAttributes) {
    return this.jwtService.signAsync({ id: user.id });
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
