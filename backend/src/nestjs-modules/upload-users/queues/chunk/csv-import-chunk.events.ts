import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { UploadGateway } from '../../../shared/events/upload.gateway';
import { CSV_IMPORT_CHUNK } from '../csv-import-queues.const';
import { CsvImportChunkOutput } from './csv-import-chunk.interfaces';

@QueueEventsListener(CSV_IMPORT_CHUNK.queueName)
export class CsvImportChunkEvents extends QueueEventsHost {
  private readonly logger = new Logger(CsvImportChunkEvents.name);

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
  onCompleted(event: { jobId: string; returnvalue: CsvImportChunkOutput }) {
    this.logger.log(
      `Chunk job ${event.jobId} finalizado. Retorno: ${JSON.stringify(event.returnvalue)}`,
    );
    const chunkResult = event.returnvalue;
    if (!chunkResult.flowId) return;
    this.uploadGateway.emitChunkCompleted(
      chunkResult.flowId,
      chunkResult.chunkIndex,
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
