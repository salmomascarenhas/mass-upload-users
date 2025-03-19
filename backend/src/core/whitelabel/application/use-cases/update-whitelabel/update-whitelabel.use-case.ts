import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundEntityError } from '../../../../shared/domain/errors/not-found-entity.error';
import { Whitelabel, WhitelabelId } from '../../../domain/whitelabel';
import { IWhitelabelRepository } from '../../../domain/whitelabel.repository';
import {
  WhitelabelOutput,
  WhitelabelOutputMapper,
} from '../common/whitelabel-output';

export class UpdateWhitelabelUseCase
  implements IUseCase<UpdateWhitelabelInput, UpdateWhitelabelOutput>
{
  constructor(private readonly whitelabelRepository: IWhitelabelRepository) {}

  async execute(input: UpdateWhitelabelInput): Promise<WhitelabelOutput> {
    const whitelabelId = new WhitelabelId(input.whitelabelId);
    const whitelabel = await this.whitelabelRepository.findById(whitelabelId);

    if (!whitelabel) throw new NotFoundEntityError(whitelabelId.id, Whitelabel);

    input.name && whitelabel.changeName(input.name);
    input.url && whitelabel.changeUrl(input.url);

    await this.whitelabelRepository.update(whitelabel);
    return WhitelabelOutputMapper.toOutput(whitelabel);
  }
}

export type UpdateWhitelabelInput = {
  whitelabelId: string;
  name?: string;
  url?: string;
};

export type UpdateWhitelabelOutput = WhitelabelOutput;
