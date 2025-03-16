import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const { method, originalUrl: url } = request;
    const ip = this.getClientIp(request);
    const userAgent = request.get('User-Agent') || '';
    const requestId = Array.isArray(request.headers['x-request-id'])
      ? request.headers['x-request-id'].join(',')
      : request.headers['x-request-id'] || 'N/A';

    this.logger.log(
      `[Request] [IP: ${ip}] [RequestID: ${requestId}] ${method} ${url} [User-Agent: ${userAgent}]`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(
          `[Response] [IP: ${ip}] [RequestID: ${requestId}] ${method} ${url} [Status: ${response.statusCode}] [Duration: ${duration}ms]`,
        );
      }),
      catchError((error) => {
        this.logError(error, method, url, ip, requestId);
        throw error;
      }),
    );
  }

  private getClientIp(request: Request): string {
    const ipAddr = request.headers['x-forwarded-for'] || request.ip;
    if (!ipAddr) return 'N/A';
    if (Array.isArray(ipAddr)) return ipAddr[ipAddr.length - 1];
    return typeof ipAddr === 'string'
      ? ipAddr.split('.').pop()?.trim().replace('::ffff:', '') || 'N/A'
      : 'N/A';
  }

  private logError(
    error: any,
    method: string,
    url: string,
    ip: string,
    requestId: string,
  ) {
    let errorMessage = '';
    let errorDetails = '';

    if (error instanceof HttpException) {
      const status = error.getStatus();
      const responseError = error.getResponse();
      if (typeof responseError === 'object' && 'message' in responseError) {
        errorDetails = JSON.stringify(responseError['message']);
      } else if (typeof responseError === 'string') {
        errorDetails = responseError;
      }
      errorMessage = `Status: ${status} | Error: ${errorDetails}`;
    } else if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
    } else {
      errorMessage = `Error: ${error.toString()}`;
    }

    this.logger.error(
      `[Error] [IP: ${ip}] [RequestID: ${requestId}] ${method} ${url} | ${errorMessage}`,
    );
  }
}
