import { ValidateNested, IsEnum, IsNotEmpty } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { DatabaseConfig } from './database';
import { MicroserviceConfig } from './microservice';
import { AuthConfig } from './auth';

enum AppEnv {
  Local = 'local',
  Staging = 'staging',
  Production = 'production',
}

export * from './auth';

export class Config {
  @IsEnum(AppEnv)
  @IsNotEmpty()
  @Expose({ name: 'app_env' })
  appEnv: string;

  @ValidateNested()
  @IsNotEmpty()
  database: DatabaseConfig;

  @ValidateNested()
  @IsNotEmpty()
  microservice: MicroserviceConfig;

  @ValidateNested()
  @Type(() => MicroserviceConfig)
  clients: Map<string, MicroserviceConfig>;

  @IsNotEmpty()
  @ValidateNested()
  auth: AuthConfig;
}
