import { BullModule } from '@nestjs/bullmq';
import { Global, InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bullmq';
import { Redis } from 'ioredis';
import { LoggerService } from '@nestjs/common';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
        loggerService: LoggerService,
      ): Promise<QueueOptions> => {
        const redisOptions = {
          host: configService.get<string>('REDIS_HOSTNAME'),
          port: configService.get<number>('REDIS_PORT', 6379),
        };
        const redisClient = new Redis(redisOptions);
        try {
          await redisClient.ping();
        } catch (error) {
          loggerService.error(
            'Redis Connection',
            'Unable to connect to Redis: ' + error.message,
          );
          throw new InternalServerErrorException(
            'Failed to connect to Redis. Please check your Redis configuration.',
          );
        } finally {
          redisClient.disconnect();
        }

        return {
          connection: {
            ...redisOptions,
          },
        };
      },
    }),
  ],
})
export class QueueModule {}
