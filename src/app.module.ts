import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './users/schemas/user.schema';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://mongo:27017/nest'),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
})
export class AppModule {}
