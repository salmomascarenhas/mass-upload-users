import { Whitelabel } from '../../../../domain/whitelabel';
import { WhitelabelSearchResult } from '../../../../domain/whitelabel.repository';
import { WhitelabelInMemoryRepository } from '../../../../infra/db/in-memory/whitelabel-in-memory.repository';
import { WhitelabelOutputMapper } from '../../common/whitelabel-output';
import { ListWhitelabelsUseCase } from '../list-whitelabels.use-case';

describe('ListWhitelabelsUseCase Unit Tests', () => {
  let useCase: ListWhitelabelsUseCase;
  let repository: WhitelabelInMemoryRepository;

  beforeEach(() => {
    repository = new WhitelabelInMemoryRepository();
    useCase = new ListWhitelabelsUseCase(repository);
  });

  test('toOutput method', () => {
    let result = new WhitelabelSearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    let output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const entity = Whitelabel.create({
      name: 'My Club',
      url: 'https://myclub.com',
    });
    result = new WhitelabelSearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity].map(WhitelabelOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const items = [
      new Whitelabel({
        name: 'Test 1',
        url: 'https://test1.com',
      }),
      new Whitelabel({
        name: 'Test 2',
        url: 'https://test2.com',
        created_at: new Date(new Date().getTime() + 100),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [items[1], items[0]].map(WhitelabelOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should return output using pagination, sort, and filter', async () => {
    const items = [
      new Whitelabel({ name: 'a', url: 'https://a.com' }),
      new Whitelabel({ name: 'AAA', url: 'https://aaa.com' }),
      new Whitelabel({ name: 'AaA', url: 'https://aaa.com' }),
      new Whitelabel({ name: 'b', url: 'https://b.com' }),
      new Whitelabel({ name: 'c', url: 'https://c.com' }),
    ];
    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(WhitelabelOutputMapper.toOutput),
      total: 5,
      current_page: 1,
      per_page: 2,
      last_page: 3,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0], items[3]].map(WhitelabelOutputMapper.toOutput),
      total: 5,
      current_page: 2,
      per_page: 2,
      last_page: 3,
    });

    output = await useCase.execute({
      page: 3,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[1]].map(WhitelabelOutputMapper.toOutput),
      total: 5,
      current_page: 3,
      per_page: 2,
      last_page: 3,
    });
  });
});
