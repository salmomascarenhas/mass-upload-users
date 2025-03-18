import { NotFoundEntityError } from '../../../../../shared/domain/errors/not-found-entity.error';
import { CpfCnpj } from '../../../../../shared/domain/value-objects/cpf-cnpj.vo';
import { User, UserId } from '../../../../domain/user';
import { UserInMemoryRepository } from '../../../../infra/db/in-memory/user-in-memory.repository';
import { DeleteUserUseCase } from '../delete-user.use-case';

describe('DeleteUserUseCase Unit Tests', () => {
  let useCase: DeleteUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new DeleteUserUseCase(repository);
  });

  it('should throw an error when user is not found', async () => {
    const userId = new UserId();

    await expect(useCase.execute({ user_id: userId.id })).rejects.toThrow(
      new NotFoundEntityError(userId.id, User),
    );
  });

  it('should delete a user', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');
    const entity = new User({
      name: 'John Doe',
      email: 'john@example.com',
      cpf_cnpj: new CpfCnpj('732.576.130-91'),
      whitelabel_id: 'whitelabel-id-123',
    });

    repository.items = [entity];

    await useCase.execute({ user_id: entity.user_id.id });

    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(repository.items.length).toBe(0);
  });
});
