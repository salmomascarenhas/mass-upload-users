// csv-import-queues.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '../shared/redis/redis.module';
import { CsvImportQueueModule } from './queues/csv-import-queues.module';
import { UploadUsersController } from './upload-users.controller';
import { UploadUsersService } from './upload-users.service';

@Module({
  imports: [RedisModule, CsvImportQueueModule],
  providers: [UploadUsersService],
  exports: [UploadUsersService],
  controllers: [UploadUsersController],
})
export class UploadUsersModule {}
