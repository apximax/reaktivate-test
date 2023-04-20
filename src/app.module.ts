import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as session from 'express-session';

import configuration from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppLoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer): void {
    const sessionMiddleware = session({
      secret: this.configService.get('secret'),
      resave: false,
      saveUninitialized: false,
    });
    
    consumer.apply(
      AppLoggerMiddleware,
      sessionMiddleware,
    )
      .forRoutes('*');
  }
}
