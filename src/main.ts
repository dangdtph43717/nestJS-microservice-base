import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import microserviceConfig, {
  MicroserviceConfig,
} from './config/types/microservice.config';
import serverConfig, {
  NodeEnv,
  ServerConfig,
} from './config/types/server.config';
import 'dd-trace/init';
import { ValidationPipe } from '@nestjs/common';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors();
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const sConfig: ServerConfig = app.get(serverConfig.KEY);
  const mcsvConfig: MicroserviceConfig = app.get(microserviceConfig.KEY);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: mcsvConfig.server.urls,
      queue: mcsvConfig.server.queue,
      noAck: mcsvConfig.server.autoAck,
      queueOptions: {
        durable: false,
      },
    },
  });

  if (sConfig.nodeEnv !== NodeEnv.PROD) {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Base Service')
      .setDescription('Rakkar Base Service API')
      .setVersion('1.0')
      .addServer('/base', 'Main')
      .build();

    app.getHttpAdapter().get('/api-docs', (req, res: Response) => {
      res.type('application/json');
      res.send(JSON.stringify(SwaggerModule.createDocument(app, config)));
    });
  }

  await app.startAllMicroservices();
  await app.listen(sConfig.port);
}
bootstrap();
