import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { RedisService } from '../../../shared/redis/redis.service';
import { CsvImportChunkOutput } from '../chunk/csv-import-chunk.interfaces';
import { CSV_IMPORT } from '../csv-import-queues.const';

export interface CsvImportParentInput {
  filePath: string;
  flowId: string;
}

export interface CsvImportParentOutput {
  flowId: string;
  totalSuccess: number;
  totalErrors: number;
  errorDetails: Array<{
    chunkIndex: number;
    line: number;
    messages: string[];
  }>;
}

@Injectable()
@Processor(CSV_IMPORT.queueName, { concurrency: 5 })
export class CsvImportProcessor extends WorkerHost {
  private readonly logger = new Logger(CsvImportProcessor.name);

  constructor(private readonly redisService: RedisService) {
    super();
  }

  async process(job: Job<CsvImportParentInput>): Promise<any> {
    const { filePath, flowId } = job.data;

    this.logger.log(
      `Processando job pai: ${job.id}, CSV: ${filePath} com flowId: ${flowId}`,
    );

    const childrenValues = await job.getChildrenValues<CsvImportChunkOutput>();

    let totalSuccess = 0;
    const errorDetails: CsvImportParentOutput['errorDetails'] = [];

    for (const chunkRes of Object.values(childrenValues)) {
      totalSuccess += chunkRes.successCount;
      chunkRes.errors.forEach((err) => {
        errorDetails.push({
          chunkIndex: chunkRes.chunkIndex,
          line: err.line,
          messages: err.messages,
        });
      });
    }

    const result: CsvImportParentOutput = {
      flowId,
      totalSuccess,
      totalErrors: errorDetails.length,
      errorDetails,
    };

    result.errorDetails.forEach((err) => {
      this.logger.error(
        `Erro na linha ${err.line} do chunk ${err.chunkIndex}: ${err.messages.join(
          ', ',
        )}`,
      );
    });

    const totalChunks = Object.keys(childrenValues).length;
    const completedChunks = Object.values(childrenValues).filter(
      (c) => c.status === 'OK',
    ).length;
    const progressPercent = Math.floor((completedChunks / totalChunks) * 100);

    const progressObj = {
      flowId,
      progressPercent,
    };
    await job.updateProgress(progressObj);

    const finalKey = `csvImport:${flowId}:final`;
    await this.redisService.redisClient.set(finalKey, JSON.stringify(result));
    this.logger.log(
      `CSV Import finalizado. Sucesso: ${totalSuccess}, Falhas: ${errorDetails.length}`,
    );

    return result;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<any>): void {
    this.logger.log(`✅ Job PAI (CSV_IMPORT) ${job.id} concluído!`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<any>): void {
    this.logger.error(`❌ Job PAI (CSV_IMPORT) ${job.id} falhou!`);
  }
}
