import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '@modules/health/health.controller';
import { ConfigModule } from '@nestjs/config';
import microserviceConfig from '@config/types/microservice.config';
import { clientProviders } from 'src/clients/provider';

@Module({
  imports: [TerminusModule, ConfigModule.forFeature(microserviceConfig)],
  controllers: [HealthController],
  providers: [HealthController, ...clientProviders],
})
export class HealthModule {}
