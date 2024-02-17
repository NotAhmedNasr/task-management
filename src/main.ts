import { NestFactory } from '@nestjs/core';
import { config as dotenv } from 'dotenv';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import config from './config';
import { DbConnection } from './db';
dotenv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  const db = DbConnection.getInstance(config.dbUri);
  await db.insureConnection();
  return app.listen(3000);
}
bootstrap();
