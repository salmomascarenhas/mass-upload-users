import { PrismaClient } from '@prisma/client';
import { SandboxedJob } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaConnectionManager } from '../../../shared/database/prisma/prisma-connection-manager';
import { CreateUserDto } from '../../../users/dto/create-user.dto';
import {
  CsvImportChunkInput,
  CsvImportChunkOutput,
} from './csv-import-chunk.interfaces';

/**
 * Processa um chunk de linhas do CSV, validando e inserindo as linhas válidas no banco
 * @param job SandboxedJob com os dados do chunk
 * @returns Promise com o resultado do processamento do chunk
 */
export default async function CsvImportChunk(
  job: SandboxedJob<CsvImportChunkInput>,
): Promise<CsvImportChunkOutput> {
  const { chunkIndex, chunk, flowId } = job.data;

  let successCount = 0;
  const errors: CsvImportChunkOutput['errors'] = [];

  try {
    const prisma: PrismaClient =
      await PrismaConnectionManager.getPrismaClient();

    const whitelabelIdSet = new Set<string>();
    for (const row of chunk) {
      whitelabelIdSet.add(row.whitelabelId);
    }
    const foundWhitelabels = await prisma.whitelabel.findMany({
      where: { id: { in: [...whitelabelIdSet] } },
      select: { id: true },
    });
    const validWhitelabelIds = new Set(foundWhitelabels.map((w) => w.id));

    const validRows: CreateUserDto[] = [];

    for (let i = 0; i < chunk.length; i++) {
      const progressObj = {
        flowId: flowId,
        progressPercent: Math.floor((i / chunk.length) * 100),
      };
      await job.updateProgress(progressObj);
      const row = chunk[i];

      const dtoInstance = plainToInstance(CreateUserDto, row);
      const validationErrors = await validate(dtoInstance);
      if (validationErrors.length > 0) {
        const messages = validationErrors
          .map((ve) => Object.values(ve.constraints || {}))
          .flat();
        errors.push({ line: i, messages });
        continue;
      }

      if (!validWhitelabelIds.has(row.whitelabelId)) {
        errors.push({
          line: i,
          messages: [`Whitelabel não encontrado: ${row.whitelabelId}`],
        });
        continue;
      }

      validRows.push(row);
    }

    if (validRows.length > 0) {
      const insertData = validRows.map((row) => ({
        name: row.name,
        email: row.email,
        cpfCnpj: row.cpfCnpj,
        whitelabelId: row.whitelabelId,
      }));

      await prisma.users.createMany({
        data: insertData,
        skipDuplicates: true,
      });

      successCount = validRows.length;
    }

    const progressObj = {
      flowId: flowId,
      progressPercent: 100,
    };
    await job.updateProgress(progressObj);
    return {
      flowId: flowId,
      status: 'OK',
      chunkIndex,
      successCount,
      errors,
    };
  } catch (error) {
    console.error(`Erro no chunk ${chunkIndex}: ${error.message}`);
    throw error;
  }
}
