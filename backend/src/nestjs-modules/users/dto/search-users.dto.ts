import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';
import { ListUsersInput } from '../../../core/user/application/use-cases/list-users/list-users.use-case';

export class SearchUsersDto implements ListUsersInput {
  @ApiPropertyOptional({
    description: 'Termo de busca no nome do Whitelabel',
    example: 'My Club',
  })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiPropertyOptional({
    description: 'Número da página para paginação',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de itens por página',
    example: 10,
    minimum: 1,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number = 10;

  @ApiPropertyOptional({
    description: 'Campo para ordenação (name, created_at, updated_at)',
    example: 'name',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Direção da ordenação (asc ou desc)',
    example: 'asc',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortDir?: SortDirection;
}
