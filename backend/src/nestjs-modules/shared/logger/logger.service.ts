import { Injectable, Logger } from '@nestjs/common';
import { LoggerServiceMethodsInterface } from './logger-service-methods.interface';

@Injectable()
export class LoggerService implements LoggerServiceMethodsInterface {
  debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      Logger.debug(`[DEBUG] ${message}`, context);
    }
  }
  log(context: string, message: string) {
    Logger.log(`[INFO] ${message}`, context);
  }

  error(context: string, message: string, trace?: string) {
    Logger.error(`[ERROR] ${message}`, trace, context);
  }

  warn(context: string, message: string) {
    Logger.warn(`[WARN] ${message}`, context);
  }

  verbose(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      Logger.verbose(`[VERBOSE] ${message}`, context);
    }
  }

  static debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      Logger.debug(`[DEBUG] ${message}`, context);
    }
  }
  static log(context: string, message: string) {
    Logger.log(`[INFO] ${message}`, context);
  }

  static error(context: string, message: string, trace?: string) {
    Logger.error(`[ERROR] ${message}`, trace, context);
  }

  static warn(context: string, message: string) {
    Logger.warn(`[WARN] ${message}`, context);
  }

  static verbose(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      Logger.verbose(`[VERBOSE] ${message}`, context);
    }
  }
}
