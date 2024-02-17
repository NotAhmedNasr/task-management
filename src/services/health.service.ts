import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  heathCheck(): any {
    return {
      status: 'up',
      time: new Date(),
    };
  }
}
