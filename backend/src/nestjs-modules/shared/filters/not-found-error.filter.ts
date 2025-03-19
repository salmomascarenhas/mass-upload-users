import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { NotFoundEntityError } from '../../../core/shared/domain/errors/not-found-entity.error';

@Catch(NotFoundEntityError)
export class NotFoundEntityErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundEntityError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      error: 'Not Found',
      message: exception.message,
    });
  }
}
