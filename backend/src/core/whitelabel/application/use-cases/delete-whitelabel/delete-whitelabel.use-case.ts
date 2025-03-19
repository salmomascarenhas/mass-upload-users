import { IUseCase } from '../../../../shared/application/use-case.interface';
import { WhitelabelId } from '../../../domain/whitelabel';
import { IWhitelabelRepository } from '../../../domain/whitelabel.repository';

export class DeleteWhitelabelUseCase
  implements IUseCase<DeleteWhitelabelInput, DeleteWhitelabelOutput>
{
  constructor(private readonly whitelabelRepository: IWhitelabelRepository) {}

  async execute(input: DeleteWhitelabelInput): Promise<void> {
    const whitelabelId = new WhitelabelId(input.whitelabelId);
    await this.whitelabelRepository.delete(whitelabelId);
  }
}

export type DeleteWhitelabelInput = {
  whitelabelId: string;
};

export type DeleteWhitelabelOutput = void;
