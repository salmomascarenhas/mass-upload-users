import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { UploadGateway } from '../../../shared/events/upload.gateway';
import { CSV_IMPORT } from '../csv-import-queues.const';
import { CsvImportParentOutput } from './create-import-csv.processor';

@QueueEventsListener(CSV_IMPORT.queueName)
export class CreateImportCsvEvents extends QueueEventsHost {
  private readonly logger = new Logger(CreateImportCsvEvents.name);
  constructor(private readonly uploadGateway: UploadGateway) {
    super();
  }

  @OnQueueEvent('progress')
  onProgress(event: {
    jobId: string;
    data: { flowId: string; progressPercent: number };
  }) {
    this.logger.log(
      `Chunk job ${event.jobId} => ${event.data.progressPercent}%`,
    );
    if (event.data.flowId) {
      this.uploadGateway.emitProgress(
        event.data.flowId,
        event.data.progressPercent,
      );
    }
  }

  @OnQueueEvent('completed')
  onCompleted(event: { jobId: string; returnvalue: CsvImportParentOutput }) {
    this.logger.log(
      `Job ${event.jobId} finalizado. Retorno: ${JSON.stringify(
        event.returnvalue,
      )}`,
    );
    const jobResult = event.returnvalue;
    if (!jobResult.flowId) return;

    this.uploadGateway.emitFinished(jobResult.flowId, jobResult);
  }

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
