import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { WhitelabelOutput } from '../../../core/whitelabel/application/use-cases/common/whitelabel-output';

export class WhitelabelPresenter {
  @ApiProperty({ description: 'ID do Whitelabel' })
  whitelabelId: string;

  @ApiProperty({ description: 'Nome do Whitelabel' })
  name: string;

  @ApiProperty({ description: 'URL do Whitelabel' })
  url: string;

  @ApiProperty({ description: 'Data de criação' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
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
