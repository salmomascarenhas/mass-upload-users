import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { CONFIG_SCHEMA_TYPE } from '../config/config.schema';

export const REDIS_CONFIG_FACTORY = {
  inject: [ConfigService],
  useFactory: (
    configService: ConfigService<CONFIG_SCHEMA_TYPE>,
  ): RedisModuleOptions => ({
    type: 'single',
    url: `redis://${configService.get<string>('REDIS_HOSTNAME')}:${parseInt(configService.get<string>('REDIS_PORT', '6379'))}`,
  }),
};
