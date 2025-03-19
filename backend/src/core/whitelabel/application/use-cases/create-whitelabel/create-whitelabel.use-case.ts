import { IUseCase } from '../../../../shared/application/use-case.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Whitelabel } from '../../../domain/whitelabel';
import { IWhitelabelRepository } from '../../../domain/whitelabel.repository';
import { WhitelabelNameAlreadyExistsError } from '../../errors/whitelabel-name-already-exists.error';
import {
  WhitelabelOutput,
  WhitelabelOutputMapper,
} from '../common/whitelabel-output';

export class CreateWhitelabelUseCase
  implements IUseCase<CreateWhitelabelInput, CreateWhitelabelOutput>
{
  constructor(private readonly whitelabelRepository: IWhitelabelRepository) {}
  async execute(input: CreateWhitelabelInput): Promise<CreateWhitelabelOutput> {
    const whitelabelWithSameName = await this.whitelabelRepository.findByName(
      input.name,
    );
    if (whitelabelWithSameName)
      throw new WhitelabelNameAlreadyExistsError(input.name, Whitelabel);

    const whitelabelEntity = Whitelabel.create({
      ...input,
    });

    if (whitelabelEntity.notification.hasErrors())
      throw new EntityValidationError(whitelabelEntity.notification.toJSON());

    this.whitelabelRepository.insert(whitelabelEntity);
    return WhitelabelOutputMapper.toOutput(whitelabelEntity);
  }
}

export type CreateWhitelabelInput = {
  name: string;
  url: string;
};

export type CreateWhitelabelOutput = WhitelabelOutput;
