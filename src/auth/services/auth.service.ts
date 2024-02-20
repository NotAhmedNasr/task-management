import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAttributes } from 'src/user/models/userAttributes.model';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  getTokenForUser(user: UserAttributes) {
    return this.jwtService.signAsync({ id: user.id });
  }
}
