import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateUserInput } from '../../../core/user/application/use-cases/create-user/create-user.use-case';

export class CreateUserDto implements CreateUserInput {
  whitelabel_id: string;
  @ApiProperty({ description: 'Nome completo do usuário', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'CPF do usuário', example: '091.012.426-44' })
  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @ApiProperty({
    description: 'ID da whitelabel',
    example: '60f6f9f0-5f5e-4b7c-8c7d-4b7c8c7d4b7c',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  whitelabelId: string;
}
