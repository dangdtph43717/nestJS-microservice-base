import { FactoryProvider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import microserviceConfiguration from '@config/types/microservice.config';
import { AUTHORIZATION_SERVICE, CORE_SERVICE } from './constants';

export const clientProviders: FactoryProvider[] = [
  {
    provide: AUTHORIZATION_SERVICE,
    useFactory: (
      microserviceConfig: ConfigType<typeof microserviceConfiguration>,
    ) => {
      const { authorizationService: config } = microserviceConfig.clients;
      if (!config) {
        return null;
      }

      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: config.urls,
          queue: config.queue,
          queueOptions: {
            durable: false,
          },
        },
      });
    },
    inject: [microserviceConfiguration.KEY],
  },
  {
    provide: CORE_SERVICE,
    useFactory: (
      microserviceConfig: ConfigType<typeof microserviceConfiguration>,
    ) => {
      const { coreService: config } = microserviceConfig.clients;
      if (!config) {
        return null;
      }

      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: config.urls,
          queue: config.queue,
          queueOptions: {
            durable: false,
          },
        },
      });
    },
    inject: [microserviceConfiguration.KEY],
  },
];
