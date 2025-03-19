import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaginationOutput } from '../../../core/shared/application/pagination-output';
import { WhitelabelOutput } from '../../../core/whitelabel/application/use-cases/common/whitelabel-output';

export class WhitelabelPresenter {
  @ApiProperty({
    description: 'ID do Whitelabel',
    example: 'f1a2b3c4-d5e6-7890-1234-56789abcdef0',
  })
  whitelabelId: string;

  @ApiProperty({
    description: 'Nome do Whitelabel',
    example: 'Minha Empresa',
  })
  name: string;

  @ApiProperty({
    description: 'URL do Whitelabel',
    example: 'https://minhaempresa.com',
  })
  url: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-03-15T10:00:00.000Z',
  })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-03-16T12:30:00.000Z',
  })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date;

  constructor(whitelabel: WhitelabelOutput) {
    this.whitelabelId = whitelabel.whitelabel_id;
    this.name = whitelabel.name;
    this.url = whitelabel.url;
    this.createdAt = whitelabel.created_at;
    this.updatedAt = whitelabel.updated_at;
  }
}

export class PaginatedWhitelabelPresenter {
  @ApiProperty({
    description: 'Lista de Whitelabels',
    type: [WhitelabelPresenter],
  })
  @Type(() => WhitelabelPresenter)
  items: WhitelabelPresenter[];

  @ApiProperty({ description: 'Total de Whitelabels encontrados', example: 3 })
  total: number;

  @ApiProperty({ description: 'Página atual', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Quantidade de itens por página', example: 10 })
  perPage: number;

  @ApiProperty({ description: 'Número total de páginas', example: 1 })
  lastPage: number;

  constructor(paginationResult: PaginationOutput<WhitelabelOutput>) {
    this.items = paginationResult.items.map(
      (whitelabel) => new WhitelabelPresenter(whitelabel),
    );
    this.total = paginationResult.total;
    this.currentPage = paginationResult.current_page;
    this.perPage = paginationResult.per_page;
    this.lastPage = paginationResult.last_page;
  }

  /**
   * Método estático para converter um `PaginationOutput<WhitelabelOutput>` em `PaginatedWhitelabelPresenter`
   * @param paginationResult Objeto contendo os dados paginados.
   * @returns `PaginatedWhitelabelPresenter` estruturado.
   */
  static toCollection(paginationResult: PaginationOutput<WhitelabelOutput>) {
    return new PaginatedWhitelabelPresenter(paginationResult);
  }
}
