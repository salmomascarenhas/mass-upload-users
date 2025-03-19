import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UserAlreadyExistsError } from '../../../core/user/application/errors/user-already-exists.error';

@Catch(UserAlreadyExistsError)
export class UserAlreadyExistsErrorFilter implements ExceptionFilter {
  catch(exception: UserAlreadyExistsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      error: 'Conflict',
      message: exception.message,
    });
  }
}
