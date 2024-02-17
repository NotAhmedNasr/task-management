import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';

@Controller()
export class HealthController {
  constructor(private readonly appService: HealthService) {}

  @Get('/health')
  healthCheck(): string {
    return this.appService.heathCheck();
  }
}
