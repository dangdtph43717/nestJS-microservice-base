import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Config } from 'src/config/types';
import { DEMO_SERVICE } from './constants';
import { ClientOption } from './types';

export const clientProviders: FactoryProvider[] = [
  {
    provide: DEMO_SERVICE,
    useFactory: (configService: ConfigService<Config, true>) => {
      const clients = configService.get<Map<string, ClientOption>>('clients');
      const options = clients.get('demo_service');
      if (!options) {
        return null;
      }

      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: options.uris,
          queue: options.queue,
          queueOptions: {
            durable: false,
          },
        },
      });
    },
    inject: [ConfigService],
  },
];
