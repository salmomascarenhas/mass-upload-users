import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { join } from 'node:path';
import { CONFIG_SCHEMA } from './config.schema';

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): Promise<DynamicModule> {
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath! : [envFilePath!]),
        join(process.cwd(), `.env.${process.env.NODE_ENV!}`),
        join(process.cwd(), `.env`),
      ],
      validationSchema: CONFIG_SCHEMA,
      ...otherOptions,
    });
  }
}
