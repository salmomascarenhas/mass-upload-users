import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { CSV_IMPORT } from '../csv-import-queues.const';

@QueueEventsListener(CSV_IMPORT.queueName)
export class CreateImportCsvEvents extends QueueEventsHost {
  private readonly logger = new Logger(CreateImportCsvEvents.name);

  @OnQueueEvent('error')
  onError(error: Error): void {
    this.logger.error(`Um erro ocorreu no CSV Import: ${error.message}`);
  }

  @OnQueueEvent('failed')
  onFailed(error: {
    jobId: string;
    failedReason: string;
    prev?: string;
  }): void {
    this.logger.error(
      `CSV Import failed. jobId: ${error.jobId}, reason: ${error.failedReason}`,
    );

    throw error.failedReason;
  }
}
