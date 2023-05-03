import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { registerAsWithValidation } from '@config/configuration';
import { DatabaseType } from 'typeorm';

export class DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: string;
  username: string;
  password: string;
  dbName: string;
}

class EnvConfig {
  @Expose()
  DATABASE_TYPE: DatabaseType;

  @Expose()
  @IsString()
  DATABASE_HOST: string;

  @Expose()
  @IsString()
  DATABASE_PORT: string;

  @Expose()
  @IsString()
  DATABASE_USERNAME: string;

  @Expose()
  @IsString()
  DATABASE_PASSWORD: string;

  @Expose()
  @IsString()
  DATABASE_NAME: string;
}

export default registerAsWithValidation(
  'database',
  EnvConfig,
  process.env,
  (config): DatabaseConfig => ({
    type: config.DATABASE_TYPE,
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    username: config.DATABASE_USERNAME,
    password: config.DATABASE_PASSWORD,
    dbName: config.DATABASE_NAME,
  }),
);
