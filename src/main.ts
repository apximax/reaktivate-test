import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ValidatorOptions, ValidationError } from 'class-validator';

import { AppModule } from './app.module';

export interface IValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.useGlobalPipes(new ValidationPipe({} as IValidationPipeOptions));
  
  await app.listen(port);

  Logger.log(`Server listening on port ${port}`);
}
bootstrap();
