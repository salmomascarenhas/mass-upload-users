import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaginationOutput } from '../../../core/shared/application/pagination-output';
import { UserOutput } from '../../../core/user/application/use-cases/common/user-output';

export class UserPresenter {
  @ApiProperty({
    description: 'ID do usuário',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  userId: string;

  @ApiProperty({ description: 'Nome completo do usuário', example: 'John Doe' })
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'CPF/CNPJ do usuário',
    example: '091.012.426-44',
  })
  cpfCnpj: string;

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

  constructor(user: UserOutput) {
    this.userId = user.user_id;
    this.name = user.name;
    this.email = user.email;
    this.cpfCnpj = user.cpf_cnpj;
    this.createdAt = user.created_at;
    this.updatedAt = user.updated_at;
  }
}

export class PaginatedUserPresenter {
  @ApiProperty({
    description: 'Lista de usuários',
    type: [UserPresenter],
  })
  @Type(() => UserPresenter)
  items: UserPresenter[];

  @ApiProperty({ description: 'Total de usuários encontrados', example: 3 })
  total: number;

  @ApiProperty({ description: 'Página atual', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Quantidade de itens por página', example: 10 })
  perPage: number;

  @ApiProperty({ description: 'Número total de páginas', example: 1 })
  lastPage: number;

  constructor(paginationResult: PaginationOutput<UserOutput>) {
    this.items = paginationResult.items.map((user) => new UserPresenter(user));
    this.total = paginationResult.total;
    this.currentPage = paginationResult.current_page;
    this.perPage = paginationResult.per_page;
    this.lastPage = paginationResult.last_page;
  }

  /**
   * Método estático para converter um `PaginationOutput<UserOutput>` em `PaginatedUserPresenter`
   * @param paginationResult Objeto contendo os dados paginados.
   * @returns `PaginatedUserPresenter` estruturado.
   */
  static toCollection(paginationResult: PaginationOutput<UserOutput>) {
    return new PaginatedUserPresenter(paginationResult);
  }
}
