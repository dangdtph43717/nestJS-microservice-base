import { ConfigModule, ConfigType } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import databaseConfiguration from '@config/types/database.config';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (
    databaseConfig: ConfigType<typeof databaseConfiguration>,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: databaseConfig.type,
      host: databaseConfig.host,
      port: parseInt(databaseConfig.port, 10),
      username: databaseConfig.username,
      database: databaseConfig.dbName,
      password: databaseConfig.password,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      synchronize: false,
      logging: true,
    } as DataSourceOptions;
  },
  imports: [ConfigModule.forFeature(databaseConfiguration)],
  inject: [databaseConfiguration.KEY],
};
