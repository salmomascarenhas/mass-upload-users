import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateWhitelabelDto {
  @ApiProperty({ description: 'Nome do Whitelabel', example: 'My Club' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'URL do Whitelabel',
    example: 'https://myclub.com',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
