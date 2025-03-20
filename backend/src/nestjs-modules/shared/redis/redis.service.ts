import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  get redisClient(): Redis {
    return this.redis;
  }

  async saveEntriesToRedis(
    key: string,
    data: any[],
    expiration?: number,
  ): Promise<void> {
    // Batch size for Redis rpush commands
    const batchSizeForRedis = 1000;

    const pipeline = this.redis.pipeline();

    for (let i = 0; i < data.length; i += batchSizeForRedis) {
      const batch = data.slice(i, i + batchSizeForRedis);
      pipeline.rpush(key, ...batch);
    }

    await pipeline.exec();
    if (expiration) {
      await this.redis.expire(key, 3600);
    }
  }

  /**
   * Removes all Redis keys containing the given operation ID.
   * This is useful when some error occurs during a job execution and the job needs to be retried.
   * @param operationId - The operation ID to search for in Redis keys
   * @returns A Promise that resolves when all related Redis entries are deleted
   */
  async deleteRelatedEntries(operationId: string): Promise<void> {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        `*${operationId}*`,
        'COUNT',
        100,
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } while (cursor !== '0');
  }

  /**
   * Deletes all Redis keys given in the `chunkKeys` array.
   * @param chunkKeys - An array of Redis keys to delete
   * @returns A Promise that resolves when all the Redis keys are deleted
   */
  async deleteEntries(chunkKeys: string[]): Promise<void> {
    const deletePromises = chunkKeys.map((key) => this.redis.del(key));
    await Promise.all(deletePromises);
  }
}
