import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { CSV_IMPORT_CHUNK } from '../csv-import-queues.const';

@QueueEventsListener(CSV_IMPORT_CHUNK.queueName)
export class CsvImportChunkEvents extends QueueEventsHost {
  private readonly logger = new Logger(CsvImportChunkEvents.name);

  @OnQueueEvent('completed')
  onCompleted(event: { jobId: string; returnvalue: any }) {
    this.logger.log(
      `Chunk job ${event.jobId} finalizado. Retorno: ${JSON.stringify(event.returnvalue)}`,
    );
  }

  @OnQueueEvent('error')
  onError(error: Error): void {
    this.logger.error(`Um erro ocorreu no CSV Import CHUNK: ${error.message}`);
  }

  @OnQueueEvent('failed')
  onFailed(error: {
    jobId: string;
    failedReason: string;
    prev?: string;
  }): void {
    this.logger.error(
      `CHUNK failed. jobId: ${error.jobId}, reason: ${error.failedReason}`,
    );
  }
}
