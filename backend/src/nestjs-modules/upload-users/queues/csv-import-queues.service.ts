import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowJob, FlowProducer, JobNode } from 'bullmq';
import { flowWaitUntilFinished } from '../../shared/bull-mq/wait-flow-function';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CsvImportChunkEvents } from './chunk/csv-import-chunk.events';
import { CsvImportChunkInput } from './chunk/csv-import-chunk.interfaces';
import { CSV_IMPORT, CSV_IMPORT_CHUNK } from './csv-import-queues.const';

export interface CsvImportFlowInput {
  filePath: string;
  linesByChunks: CreateUserDto[][];
  flowId: string;
}

@Injectable()
export class CsvImportQueuesService {
  constructor(
    @InjectFlowProducer(CSV_IMPORT.producer)
    private readonly flowProducer: FlowProducer,
    private readonly csvImportChunkEvents: CsvImportChunkEvents,
  ) {}

  /**
   * Cria o flow de processamento do CSV.
   * - Job pai: CSV_IMPORT
   * - Jobs filhos: CSV_IMPORT_CHUNK (cada chunk do CSV)
   */
  async createCsvImportFlow({
    filePath,
    linesByChunks,
    flowId,
  }: CsvImportFlowInput): Promise<JobNode> {
    // Define o job pai
    const parentJob: FlowJob = {
      name: CSV_IMPORT.jobName,
      queueName: CSV_IMPORT.queueName,
      data: { filePath, flowId },
      children: [],
      opts: {
        removeOnComplete: true,
        removeOnFail: 5,
      },
    };

    linesByChunks.forEach((chunk, index) => {
      parentJob.children!.push({
        name: CSV_IMPORT_CHUNK.jobName,
        queueName: CSV_IMPORT_CHUNK.queueName,
        data: {
          chunkIndex: index,
          chunk,
        } as CsvImportChunkInput,
        opts: {
          removeOnComplete: true,
          removeOnFail: 5,
        },
      });
    });

    return this.flowProducer.add(parentJob);
  }

  async waitForCreateDesempenhoFlow(flowJob: JobNode): Promise<void> {
    const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos
    await flowWaitUntilFinished(
      flowJob,
      TIMEOUT_MS,
      this.csvImportChunkEvents.queueEvents,
    );
  }
}
