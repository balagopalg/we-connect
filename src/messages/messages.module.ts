import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagesService } from './messages.service';
import { MessageSchema } from './schemas/messages.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { PassportModule } from '@nestjs/passport';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { MessageGateway } from './messages.gateway';
import { ApplicationLogger } from '@application/logger/logger';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${configService.get<string>('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@rabbitmq:5672`,
          ],
          queue: 'messages_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [
    MessagesService,
    RabbitmqService,
    MessageGateway,
    { provide: 'applicationLogger', useClass: ApplicationLogger },
  ],
  controllers: [MessagesController],
})
export class MessagingModule {}
