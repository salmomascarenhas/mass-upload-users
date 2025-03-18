import { NotFoundEntityError } from '../../../../../shared/domain/errors/not-found-entity.error';
import { CpfCnpj } from '../../../../../shared/domain/value-objects/cpf-cnpj.vo';
import { InvalidUuidError } from '../../../../../shared/domain/value-objects/uuid.vo';
import { User, UserId } from '../../../../domain/user';
import { UserInMemoryRepository } from '../../../../infra/db/in-memory/user-in-memory.repository';
import {
  UpdateUserInput,
  UpdateUserOutput,
  UpdateUserUseCase,
} from '../update-user.use-case';

describe('UpdateUserUseCase Unit Tests', () => {
  let useCase: UpdateUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new UpdateUserUseCase(repository);
  });

  it('should throw error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ user_id: 'fake-id', name: 'fake' }),
    ).rejects.toThrow(new InvalidUuidError());

    const userId = new UserId();

    await expect(() =>
      useCase.execute({ user_id: userId.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundEntityError(userId.id, User));
  });

  it('should update a user', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new User({
      name: 'John Doe',
      email: 'john@example.com',
      cpf_cnpj: new CpfCnpj('732.576.130-91'),
      whitelabel_id: 'whitelabel-id-123',
    });
    repository.items = [entity];

    let output = await useCase.execute({
      user_id: entity.user_id.id,
      name: 'Jane Doe',
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      user_id: entity.user_id.id,
      name: 'Jane Doe',
      email: entity.email,
      cpf_cnpj: entity.cpf_cnpj.getFormatted(),
      whitelabel_id: entity.whitelabel_id,
      created_at: entity.created_at,
      updated_at: expect.any(Date),
    });

    const arrange: Array<{
      input: UpdateUserInput;
      expected: UpdateUserOutput;
    }> = [
      {
        input: { user_id: entity.user_id.id, name: 'Jane Doe' },
        expected: {
          user_id: entity.user_id.id,
          name: 'Jane Doe',
          email: entity.email,
          cpf_cnpj: entity.cpf_cnpj.getFormatted(),
          whitelabel_id: entity.whitelabel_id,
          created_at: entity.created_at,
          updated_at: expect.any(Date),
        },
      },
      {
        input: { user_id: entity.user_id.id, email: 'jane@example.com' },
        expected: {
          user_id: entity.user_id.id,
          name: 'Jane Doe',
          email: 'jane@example.com',
          cpf_cnpj: entity.cpf_cnpj.getFormatted(),
          whitelabel_id: entity.whitelabel_id,
          created_at: entity.created_at,
          updated_at: expect.any(Date),
        },
      },
      {
        input: { user_id: entity.user_id.id, cpf_cnpj: '278.475.335-29' },
        expected: {
          user_id: entity.user_id.id,
          name: 'Jane Doe',
          email: 'jane@example.com',
          cpf_cnpj: '278.475.335-29',
          whitelabel_id: entity.whitelabel_id,
          created_at: entity.created_at,
          updated_at: expect.any(Date),
        },
      },
      {
        input: {
          user_id: entity.user_id.id,
          name: 'John Smith',
          email: 'john.smith@example.com',
          cpf_cnpj: '732.576.130-91',
        },
        expected: {
          user_id: entity.user_id.id,
          name: 'John Smith',
          email: 'john.smith@example.com',
          cpf_cnpj: '732.576.130-91',
          whitelabel_id: entity.whitelabel_id,
          created_at: entity.created_at,
          updated_at: expect.any(Date),
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute(i.input);
      expect(output).toStrictEqual(i.expected);
    }
  });
});
