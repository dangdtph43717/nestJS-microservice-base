import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import authConfig from '@config/types/auth.config';
import { clientProviders } from 'src/clients/provider';
import microserviceConfig from '@config/types/microservice.config';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(microserviceConfig),
  ],
  providers: [JwtStrategy, ...clientProviders],
})
export class AuthModule {}
