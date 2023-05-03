import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigType } from '@nestjs/config';
import databaseConfiguration from '@config/types/database.config';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseConfig: ConfigType<typeof databaseConfiguration> =
  databaseConfiguration();

export const AppDataSource = new DataSource({
  type: databaseConfig.type,
  host: databaseConfig.host,
  port: parseInt(databaseConfig.port, 10),
  username: databaseConfig.username,
  database: databaseConfig.dbName,
  password: databaseConfig.password,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/migrations/',
  },
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  synchronize: false,
  logging: true,
} as DataSourceOptions);
