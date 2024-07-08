import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SocketIOAdapter } from './socket-io.adapter';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const PORT = parseInt(configService.get('PORT'), 10) || 3001;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({ origin: '*' });
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    const microserviceOptions = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${configService.get<string>('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@rabbitmq:5672`,
        ],
        queue: 'main_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

    app.enableCors({
      origin: [
        `http://localhost:${PORT}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${PORT}/`),
      ],
    });
    app.useWebSocketAdapter(new SocketIOAdapter(app));

    app.connectMicroservice(microserviceOptions);

    await app.startAllMicroservices();
    await app.listen(PORT, () => {
      console.log(`🚀 Application running at port ${PORT}`);
    });
  } catch (err) {
    throw err;
  }
}
bootstrap();
