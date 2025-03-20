import { CreateUserDto } from '../../../users/dto/create-user.dto';

/**
 * Dados que cada chunk (job filho) recebe
 */
export interface CsvImportChunkInput {
  chunkIndex: number;
  chunk: CreateUserDto[];
}

/**
 * Resultado de cada chunk (job filho)
 */
export interface CsvImportChunkOutput {
  status: string; // "OK", "PARTIAL", etc.
  chunkIndex: number;
  successCount: number;
  errors: Array<{
    line: number;
    messages: string[];
  }>;
}
