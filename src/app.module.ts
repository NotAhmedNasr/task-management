import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { LoggerModule } from 'nestjs-pino';
import { HealthService } from './services/health.service';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}
