import { Expose, Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { registerAsWithValidation } from '@config/configuration';

export class AmqpConnectionConfig {
  urls: string[];
  queue: string;
  autoAck?: boolean;
}

export class MicroserviceClientConfig {
  authorizationService: AmqpConnectionConfig;
  coreService: AmqpConnectionConfig;
}

export class MicroserviceConfig {
  server: AmqpConnectionConfig;
  clients: MicroserviceClientConfig;
}

class EnvConfig {
  @Expose()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  MSVC_SERVER_URLS: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  MSVC_SERVER_QUEUE_NAME: string;

  @Expose()
  @IsBoolean()
  MSVC_SERVER_AUTO_ACK: boolean;

  @Expose()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  MSVC_CLIENT_AUTH_SVC_URLS: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  MSVC_CLIENT_AUTH_SVC_QUEUE_NAME: string;

  @Expose()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  MSVC_CLIENT_CORE_SVC_URLS: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  MSVC_CLIENT_CORE_SVC_QUEUE_NAME: string;
}

export default registerAsWithValidation(
  'microservice',
  EnvConfig,
  process.env,
  (config): MicroserviceConfig => ({
    server: {
      urls: config.MSVC_SERVER_URLS,
      queue: config.MSVC_SERVER_QUEUE_NAME,
      autoAck: config.MSVC_SERVER_AUTO_ACK,
    },
    clients: {
      authorizationService: {
        urls: config.MSVC_CLIENT_AUTH_SVC_URLS,
        queue: config.MSVC_CLIENT_AUTH_SVC_QUEUE_NAME,
      },
      coreService: {
        urls: config.MSVC_CLIENT_CORE_SVC_URLS,
        queue: config.MSVC_CLIENT_CORE_SVC_QUEUE_NAME,
      },
    },
  }),
);
