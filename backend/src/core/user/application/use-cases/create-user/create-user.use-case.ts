import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundEntityError } from '../../../../shared/domain/errors/not-found-entity.error';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { CpfCnpj } from '../../../../shared/domain/value-objects/cpf-cnpj.vo';
import {
  Whitelabel,
  WhitelabelId,
} from '../../../../whitelabel/domain/whitelabel';
import { IWhitelabelRepository } from '../../../../whitelabel/domain/whitelabel.repository';
import { User } from '../../../domain/user';
import { IUserRepository } from '../../../domain/user.repository';
import { UserAlreadyExistsError } from '../../errors/user-already-exists.error';
import { UserOutput, UserOutputMapper } from '../common/user-output';

export class CreateUserUseCase
  implements IUseCase<CreateUserInput, CreateUserOutput>
{
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly whitelabelRepo: IWhitelabelRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const cpfCnpj = new CpfCnpj(input.cpf_cnpj);

    const whitelabelId = new WhitelabelId(input.whitelabel_id);
    const whitelabel = await this.whitelabelRepo.findById(whitelabelId);
    if (!whitelabel)
      throw new NotFoundEntityError(whitelabelId.toString(), Whitelabel);

    const userWithSameCpfCnpj = await this.userRepo.findByCpfCnpj(
      cpfCnpj,
      whitelabelId,
    );
    if (userWithSameCpfCnpj)
      throw new UserAlreadyExistsError(cpfCnpj.toString(), User);

    const userWithSameEmail = await this.userRepo.findByEmail(
      input.email,
      whitelabelId,
    );
    if (userWithSameEmail) throw new UserAlreadyExistsError(input.email, User);

    const userEntity = User.create({
      ...input,
      cpf_cnpj: cpfCnpj,
    });

    if (userEntity.notification.hasErrors())
      throw new EntityValidationError(userEntity.notification.toJSON());

    await this.userRepo.insert(userEntity);
    return UserOutputMapper.toOutput(userEntity);
  }
}

export type CreateUserInput = {
  name: string;
  email: string;
  cpf_cnpj: string;
  whitelabel_id: string;
};

export type CreateUserOutput = UserOutput;
