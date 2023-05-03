import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { registerAsWithValidation } from '@config/configuration';
import { DatabaseType } from 'typeorm';

export class AuthConfig {
  userPoolId: string;
  clientId: string;
  region: string;
}

class EnvConfig {
  @Expose()
  @IsString()
  USER_POOL_ID: DatabaseType;

  @Expose()
  @IsString()
  CLIENT_ID: string;

  @Expose()
  @IsString()
  REGION: string;
}

export default registerAsWithValidation(
  'auth',
  EnvConfig,
  process.env,
  (config): AuthConfig => ({
    userPoolId: config.USER_POOL_ID,
    clientId: config.CLIENT_ID,
    region: config.REGION,
  }),
);
