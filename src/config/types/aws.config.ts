import { registerAsWithValidation } from '@config/configuration';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AwsClientConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

class EnvConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  AWS_ACCESS_KEY_ID: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  AWS_SECRET_ACCESS_KEY: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;
}

export default registerAsWithValidation(
  'aws',
  EnvConfig,
  process.env,
  (config): AwsClientConfig => ({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_REGION,
  }),
);
