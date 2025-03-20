import { Inject, Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { nanoid } from 'nanoid';
import { RedisService } from '../shared/redis/redis.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CsvImportQueuesService } from './queues/csv-import-queues.service';

@Injectable()
export class UploadUsersService {
  constructor(
    @Inject(CsvImportQueuesService)
    private readonly csvImportQueuesService: CsvImportQueuesService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 1) Lê o CSV e divide em chunks
   * 2) Cria o flow (job pai + subjobs) via csvImportQueuesService
   * 3) Aguarda o flow ser concluido
   * 4) Busca o resultado final no redis
   * 4) Retorna o resultado final.
   */
  async uploadUsers({ filePath }: { filePath: string }) {
    const flowId = nanoid();
    const linesByChunks = await this.readCsvFile(filePath);

    const jobNode = await this.csvImportQueuesService.createCsvImportFlow({
      filePath,
      flowId,
      linesByChunks,
    });

    await this.csvImportQueuesService.waitForCreateDesempenhoFlow(jobNode);

    const finalKey = `csvImport:${flowId}:final`;
    const rawResult = await this.redisService.redisClient.get(finalKey);
    const finalResult = rawResult ? JSON.parse(rawResult) : null;

    return finalResult || { message: 'Nenhum resultado encontrado' };
  }

  /**
   * Lê o CSV usando stream e divide em chunks de 500
   */
  private async readCsvFile(filePath: string): Promise<CreateUserDto[][]> {
    const batchSize = 500;
    const linesByChunks: CreateUserDto[][] = [];
    let batch: CreateUserDto[] = [];

    const stream = createReadStream(filePath).pipe(csvParser());

    for await (const row of stream) {
      batch.push(row as CreateUserDto);

      if (batch.length >= batchSize) {
        linesByChunks.push(batch);
        batch = [];
      }
    }

    if (batch.length > 0) linesByChunks.push(batch);

    console.log(`CSV lido e dividido em ${linesByChunks.length} chunks`);
    return linesByChunks;
  }
}
