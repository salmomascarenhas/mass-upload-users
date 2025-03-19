import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
