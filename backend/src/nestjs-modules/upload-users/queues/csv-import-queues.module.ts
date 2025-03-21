import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CONFIG_SCHEMA_TYPE } from '../../shared/config/config.schema';
import { UploadGateway } from '../../shared/events/upload.gateway';
import { RedisModule } from '../../shared/redis/redis.module';
import { CsvImportChunkEvents } from './chunk/csv-import-chunk.events';
import { CreateImportCsvEvents } from './create/create-import-csv.events';
import { CsvImportProcessor } from './create/create-import-csv.processor';
import { CSV_IMPORT, CSV_IMPORT_CHUNK } from './csv-import-queues.const';
import { CsvImportQueuesService } from './csv-import-queues.service';

@Module({
  imports: [
    RedisModule,
    BullModule.registerFlowProducer({
      name: CSV_IMPORT.producer,
    }),
    BullModule.registerQueueAsync(
      {
        name: CSV_IMPORT.queueName,
      },
      {
        name: CSV_IMPORT_CHUNK.queueName,
        useFactory: (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => ({
          processors: [
            {
              connection: {
                host: configService.get<string>('REDIS_HOSTNAME'),
                port: parseInt(configService.get<string>('REDIS_PORT', '6379')),
              },
              path: join(__dirname, 'chunk', 'csv-import-chunk.sandbox.js'),
              concurrency: 10,
            },
          ],
        }),
        inject: [ConfigService],
      },
    ),

    BullBoardModule.forFeature(
      {
        name: CSV_IMPORT.queueName,
        adapter: BullMQAdapter,
      },
      {
        name: CSV_IMPORT_CHUNK.queueName,
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [
    CsvImportQueuesService,
    CsvImportChunkEvents,
    CreateImportCsvEvents,
    CsvImportProcessor,
    UploadGateway,
  ],
  exports: [
    CsvImportQueuesService,
    CsvImportChunkEvents,
    CreateImportCsvEvents,
    CsvImportProcessor,
  ],
})
export class CsvImportQueueModule {}
