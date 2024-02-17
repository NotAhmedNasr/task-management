import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  findMany() {
    return [];
  }

  findOne() {
    return {};
  }

  create() {
    return { msg: 'create user' };
  }
}
