import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundEntityError } from '../../../../shared/domain/errors/not-found-entity.error';
import { Whitelabel, WhitelabelId } from '../../../domain/whitelabel';
import { IWhitelabelRepository } from '../../../domain/whitelabel.repository';
import {
  WhitelabelOutput,
  WhitelabelOutputMapper,
} from '../common/whitelabel-output';

export class GetWhitelabelUseCase
  implements IUseCase<GetWhitelabelInput, GetWhitelabelOutput>
{
  constructor(private readonly whitelabelRepository: IWhitelabelRepository) {}

  async execute(input: GetWhitelabelInput): Promise<GetWhitelabelOutput> {
    const whitelabelId = new WhitelabelId(input.whitelabelId);
    const whitelabel = await this.whitelabelRepository.findById(whitelabelId);

    if (!whitelabel)
      throw new NotFoundEntityError(whitelabelId.toString(), Whitelabel);

    return WhitelabelOutputMapper.toOutput(whitelabel);
  }
}

export type GetWhitelabelInput = {
  whitelabelId: string;
};

export type GetWhitelabelOutput = WhitelabelOutput;
