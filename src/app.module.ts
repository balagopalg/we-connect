import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './users/schemas/user.schema';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { HoroscopeService } from './horoscope/horoscope.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagingModule } from './messages/messages.module';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { MessageGateway } from './messages/messages.gateway';
import { ApplicationLogger } from '@application/logger/logger';

const configService = new ConfigService();

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://mongo:27017/nest'),
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MessagingModule,
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
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    AuthService,
    HoroscopeService,
    RabbitmqService,
    MessageGateway,
    { provide: 'applicationLogger', useClass: ApplicationLogger },
  ],
})
export class AppModule {}
