import { NotFoundEntityError } from '../../../../../shared/domain/errors/not-found-entity.error';
import { CpfCnpj } from '../../../../../shared/domain/value-objects/cpf-cnpj.vo';
import { User, UserId } from '../../../../domain/user';
import { UserInMemoryRepository } from '../../../../infra/db/in-memory/user-in-memory.repository';
import { GetUserUseCase } from '../get-user.use-case';

describe('GetUserUseCase Unit Tests', () => {
  let useCase: GetUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new GetUserUseCase(repository);
  });

  it('should throw an error when user is not found', async () => {
    const userId = new UserId();

    await expect(useCase.execute({ user_id: userId.id })).rejects.toThrow(
      new NotFoundEntityError(userId.id, User),
    );
  });

  it('should return a user', async () => {
    const entity = new User({
      name: 'John Doe',
      email: 'john@example.com',
      cpf_cnpj: new CpfCnpj('732.576.130-91'),
      whitelabel_id: 'whitelabel-id-123',
    });

    repository.items = [entity];

    const output = await useCase.execute({ user_id: entity.user_id.id });

    expect(output).toStrictEqual({
      user_id: entity.user_id.id,
      name: entity.name,
      email: entity.email,
      cpf_cnpj: entity.cpf_cnpj.getFormatted(),
      whitelabel_id: entity.whitelabel_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  });
});
