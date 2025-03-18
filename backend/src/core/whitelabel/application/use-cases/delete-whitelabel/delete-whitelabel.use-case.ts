import { IUseCase } from '../../../../shared/application/use-case.interface';
import { WhitelabelId } from '../../../domain/whitelabel';
import { IWhitelabelRepository } from '../../../domain/whitelabel.repository';

export class DeleteWhitelabelUseCase
  implements IUseCase<DeleteWhitelabelInput, DeleteWhitelabelOutput>
{
  constructor(private readonly whitelabelRepository: IWhitelabelRepository) {}

  async execute(input: DeleteWhitelabelInput): Promise<void> {
    const whitelabelId = new WhitelabelId(input.whitelabel_id);
    await this.whitelabelRepository.delete(whitelabelId);
  }
}

export type DeleteWhitelabelInput = {
  whitelabel_id: string;
};

export type DeleteWhitelabelOutput = void;
