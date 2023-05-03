import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '@packages/authorization';
import { Transport } from '@nestjs/microservices';
import { ConfigType } from '@nestjs/config';
import microserviceConfiguration from '@config/types/microservice.config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    @Inject(microserviceConfiguration.KEY)
    private microserviceConfig: ConfigType<typeof microserviceConfiguration>,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.microservice.pingCheck('rmq', {
          transport: Transport.RMQ,
          options: {
            urls: this.microserviceConfig.server.urls,
            queue: this.microserviceConfig.server.queue,
            queueOptions: {
              durable: false,
            },
          },
          timeout: 2000,
        }),
    ]);
  }
}
