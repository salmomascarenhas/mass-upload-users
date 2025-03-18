import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundEntityError } from '../../../../shared/domain/errors/not-found-entity.error';
import { User, UserId } from '../../../domain/user';
import { IUserRepository } from '../../../domain/user.repository';

export class DeleteUserUseCase
  implements IUseCase<DeleteUserInput, DeleteUserOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const userId = new UserId(input.user_id);
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundEntityError(userId.id, User);

    await this.userRepository.delete(userId);
  }
}

export type DeleteUserInput = {
  user_id: string;
};

export type DeleteUserOutput = void;
