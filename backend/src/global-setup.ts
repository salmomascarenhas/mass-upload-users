import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomHttpExceptionFilter } from './nestjs-modules/shared/filters/custom-http-exception.filter';
import { EntityValidationErrorFilter } from './nestjs-modules/shared/filters/entity-validation-error.filter';
import { NotFoundEntityErrorFilter } from './nestjs-modules/shared/filters/not-found-error.filter';
import { UserAlreadyExistsErrorFilter } from './nestjs-modules/shared/filters/user-already-exists-error.filter';
import { LoggerInterceptor } from './nestjs-modules/shared/interceptors/logger.interceptor';

export function applyGlobalSetup(app: INestApplication) {
  app.useGlobalInterceptors(
    new LoggerInterceptor(),
    // new TimeoutInterceptor(), TODO: Será necessário usar um interceptor de timeout considerando que a apalicação é de upload de arquivos?
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new CustomHttpExceptionFilter(),
    new EntityValidationErrorFilter(),
    new NotFoundEntityErrorFilter(),
    new UserAlreadyExistsErrorFilter(),
  );
}
