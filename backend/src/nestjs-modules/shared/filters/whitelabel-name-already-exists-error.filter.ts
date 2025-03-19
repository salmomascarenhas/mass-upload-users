import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { WhitelabelNameAlreadyExistsError } from '../../../core/whitelabel/application/errors/whitelabel-name-already-exists.error';

@Catch(WhitelabelNameAlreadyExistsError)
export class WhitelabelNameAlreadyExistsErrorFilter implements ExceptionFilter {
  catch(exception: WhitelabelNameAlreadyExistsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      error: 'Whitelabel Name Already Exists',
      message: exception.message,
    });
  }
}
