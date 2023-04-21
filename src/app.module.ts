import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import RedisStore from 'connect-redis';

import configuration from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppLoggerMiddleware } from './logger.middleware';
import { BlockUserMiddleware } from './block-user.middleware';

import { RedisService } from './redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule implements NestModule {
  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}
  
  async configure(consumer: MiddlewareConsumer): Promise<void> {
    const RedisStoreSession = new RedisStore({
      client: await this.redisService.getClient()
    });
    
    const sessionMiddleware = session({
      store: RedisStoreSession,
      secret: this.configService.get('secret'),
      resave: false,
      saveUninitialized: false,
    });

    consumer
      .apply(
        AppLoggerMiddleware,
        sessionMiddleware,
      )
      .forRoutes('*')
      .apply(BlockUserMiddleware)
      .exclude('/login')
      .forRoutes('*');
  }
}
