import { ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bullmq';
import { CONFIG_SCHEMA_TYPE } from '../config/config.schema';

export const BULL_CONFIG_FACTORY = {
  inject: [ConfigService],
  useFactory: (
    configService: ConfigService<CONFIG_SCHEMA_TYPE>,
  ): QueueOptions => ({
    connection: {
      host: configService.get<string>('REDIS_HOSTNAME'),
      port: parseInt(configService.get<string>('REDIS_PORT', '6379')),
    },
  }),
};
