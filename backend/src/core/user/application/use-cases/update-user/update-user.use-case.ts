import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundEntityError } from '../../../../shared/domain/errors/not-found-entity.error';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { CpfCnpj } from '../../../../shared/domain/value-objects/cpf-cnpj.vo';
import { User, UserId } from '../../../domain/user';
import { IUserRepository } from '../../../domain/user.repository';
import { UserOutput, UserOutputMapper } from '../common/user-output';

export class UpdateUserUseCase
  implements IUseCase<UpdateUserInput, UpdateUserOutput>
{
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UserOutput> {
    const userId = new UserId(input.user_id);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundEntityError(userId.id, User);

    if (input.name) user.changeName(input.name);
    if (input.email) user.changeEmail(input.email);
    if (input.cpf_cnpj) user.changeCpfCnpj(new CpfCnpj(input.cpf_cnpj));

    if (user.notification.hasErrors()) {
      throw new EntityValidationError(user.notification.toJSON());
    }

    await this.userRepo.update(user);
    return UserOutputMapper.toOutput(user);
  }
}

export type UpdateUserInput = {
  user_id: string;
  name?: string;
  email?: string;
  cpf_cnpj?: string;
};

export type UpdateUserOutput = UserOutput;
