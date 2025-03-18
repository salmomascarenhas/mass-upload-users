import { CpfCnpj } from '../../../../../shared/domain/value-objects/cpf-cnpj.vo';
import { User, UserId } from '../../../../domain/user';
import { UserSearchResult } from '../../../../domain/user.repository';
import { UserInMemoryRepository } from '../../../../infra/db/in-memory/user-in-memory.repository';
import { UserOutputMapper } from '../../common/user-output';
import { ListUsersUseCase } from '../list-users.use-case';

describe('ListUsersUseCase Unit Tests', () => {
  let useCase: ListUsersUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new ListUsersUseCase(repository);
  });

  test('toOutput method', () => {
    let result = new UserSearchResult({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 2,
    });

    let output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 2,
      last_page: 0,
    });

    const entity = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf_cnpj: new CpfCnpj('646.363.891-90'),
      whitelabel_id: 'whitelabel-id-123',
    });

    result = new UserSearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity].map(UserOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it('should return output sorted by created_at when input is empty', async () => {
    const items = [
      new User({
        user_id: new UserId(),
        name: 'test 1',
        email: 'test1@example.com',
        cpf_cnpj: new CpfCnpj('646.363.891-90'),
        whitelabel_id: 'whitelabel-id-123',
      }),
      new User({
        name: 'test 2',
        email: 'test2@example.com',
        cpf_cnpj: new CpfCnpj('646.363.891-90'),
        whitelabel_id: 'whitelabel-id-123',
        created_at: new Date(new Date().getTime() + 100),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [items[1], items[0]].map(UserOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should return output using pagination, sort, and filter', async () => {
    const items = [
      new User({
        name: 'a',
        email: 'a@example.com',
        cpf_cnpj: new CpfCnpj('646.363.891-90'),
        whitelabel_id: 'whitelabel-id-123',
      }),
      new User({
        name: 'AAA',
        email: 'aaa@example.com',
        cpf_cnpj: new CpfCnpj('646.363.891-90'),
        whitelabel_id: 'whitelabel-id-123',
      }),
      new User({
        name: 'AaA',
        email: 'aaa@example.com',
        cpf_cnpj: new CpfCnpj('646.363.891-90'),
        whitelabel_id: 'whitelabel-id-123',
      }),
      new User({
        name: 'b',
        email: 'b@example.com',
        cpf_cnpj: new CpfCnpj('646.363.891-90'),
        whitelabel_id: 'whitelabel-id-123',
      }),
      new User({
        name: 'c',
        email: 'c@example.com',
        cpf_cnpj: new CpfCnpj('646.363.891-90'),
        whitelabel_id: 'whitelabel-id-123',
      }),
    ];
    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(UserOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0]].map(UserOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[2], items[1]].map(UserOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
