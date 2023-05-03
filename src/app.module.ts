import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { typeOrmConfig } from './config/typeorm.config';
import serverConfig, { NodeEnv } from '@config/types/server.config';
import authConfig from '@config/types/auth.config';
import awsConfig from '@config/types/aws.config';
import databaseConfig from '@config/types/database.config';
import microserviceConfig from '@config/types/microservice.config';
import { HealthModule } from '@modules/health/health.module';
import { clientProviders } from './clients/provider';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@packages/authorization';
import { CommonModule } from '@modules/common/common.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        serverConfig,
        authConfig,
        awsConfig,
        databaseConfig,
        microserviceConfig,
      ],
    }),
    LoggerModule.forRootAsync({
      useFactory: async (sConfig: ConfigType<typeof serverConfig>) => ({
        pinoHttp: {
          level: sConfig.nodeEnv !== NodeEnv.PROD ? 'debug' : 'info',
          formatters: {
            level: (label: string) => ({ level: label }),
          },
        },
      }),
      imports: [ConfigModule.forFeature(serverConfig)],
      inject: [serverConfig.KEY],
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    HealthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }, ...clientProviders],
})
export class AppModule {}
