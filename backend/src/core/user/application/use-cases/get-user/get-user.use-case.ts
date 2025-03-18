import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IUserRepository } from '../../../domain/user.repository';
import { UserOutput, UserOutputMapper } from '../common/user-output';
import { User, UserId } from '../../../domain/user';
import { NotFoundEntityError } from '../../../../shared/domain/errors/not-found-entity.error';

export class GetUserUseCase implements IUseCase<GetUserInput, GetUserOutput> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const userId = new UserId(input.user_id);
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundEntityError(userId.id, User);
    return UserOutputMapper.toOutput(user);
  }
}

export class GetUserInput {
  user_id: string;
}

export type GetUserOutput = UserOutput;
