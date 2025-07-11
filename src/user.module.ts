import { Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.schema';
import { UserClientsModule } from './grpc client/user-client.module';
import { UserDatabaseModule } from './mongodb/database.module';
import { UserRepository } from './user.repository';
import { VideoClientsModule } from './grpc client/video-client.module';
import mongoConfig from './mongodb/database.config';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { LoggerMiddleware } from './middleware/loggerMiddleware';
import { UserGrpcController } from './user-grpc.controller';
import { JwtRemoteAuthGuard } from './jwt-remote-auth.guard';
import { AuthClientsModule } from './grpc client/auth-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserClientsModule,
    UserDatabaseModule,
    VideoClientsModule,
    AuthClientsModule,
  ],
  controllers: [UserController, UserGrpcController],
  providers: [UserService, UserRepository, JwtRemoteAuthGuard],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
