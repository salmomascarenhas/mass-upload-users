import { RedisModule as IoRedis } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { REDIS_CONFIG_FACTORY } from './redis.config';
import { RedisService } from './redis.service';

@Module({
  imports: [IoRedis.forRootAsync(REDIS_CONFIG_FACTORY)],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
