import { Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize';

export class DbConnection {
  private constructor(connectionString: string) {
    this.sequelize = new Sequelize(connectionString);
  }

  private sequelize: Sequelize;
  private readonly logger = new Logger(DbConnection.name);
  private static instance: DbConnection;

  static getInstance(connectionString: string) {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new DbConnection(connectionString);
    return this.instance;
  }

  async insureConnection() {
    await this.sequelize.authenticate();
    this.logger.log('DB connection is OK!');
  }
}
