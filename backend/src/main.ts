import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { urlencoded } from 'express';
import { AppModule } from './app.module';
import { applyGlobalSetup } from './global-setup';
import { CONFIG_SCHEMA_TYPE } from './nestjs-modules/config/config.schema';
import { SwaggerGlobalSetup } from './swagger-global-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port, host, environment } = getInitialEnvironments(app);
  const logger = new Logger('Bootstrap');

  app.use(urlencoded({ limit: '1mb', extended: true }));

  if (environment === 'prod') {
    const origin: string = app
      .get(ConfigService<CONFIG_SCHEMA_TYPE>)
      .get<string>('SERVER_CORS_ORIGIN')!;
    app.enableCors({ origin, credentials: true });
  } else {
    app.enableCors({ origin: '*' });
    SwaggerGlobalSetup.apply(app);
  }

  applyGlobalSetup(app);
  await app.listen(port);
  logger.verbose(
    'Bootstrap',
    `Server running on host:${host} and PORT:${port} in ${environment} mode`,
  );
}
bootstrap();

function getInitialEnvironments(app: INestApplication) {
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT')!;
  const host = configService.get<string>('SERVER_HOSTNAME')!;
  const environment: string = configService.get<string>('NODE_ENV')!;

  return { port, host, environment };
}
