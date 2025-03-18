import { Whitelabel } from '../../../../domain/whitelabel';
import { WhitelabelInMemoryRepository } from '../../../../infra/db/in-memory/whitelabel-in-memory.repository';
import { WhitelabelAlreadyExistsError } from '../../../errors/whitelabel-already-exists.error';
import { CreateWhitelabelUseCase } from '../create-whitelabel.use-case';

describe('CreateWhitelabelUseCase Unit Tests', () => {
  let useCase: CreateWhitelabelUseCase;
  let repository: WhitelabelInMemoryRepository;

  beforeEach(() => {
    repository = new WhitelabelInMemoryRepository();
    useCase = new CreateWhitelabelUseCase(repository);
  });

  it('should create a new whitelabel', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');

    const input = {
      name: 'My Club',
      url: 'https://myclub.com',
    };

    const output = await useCase.execute(input);

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      whitelabel_id: repository.items[0].whitelabel_id.id,
      name: repository.items[0].name,
      url: repository.items[0].url,
      created_at: repository.items[0].created_at,
      updated_at: repository.items[0].updated_at,
    });
  });

  it('should not allow duplicate whitelabel names', async () => {
    const input = {
      name: 'Existing Whitelabel',
      url: 'https://existing.com',
    };

    await useCase.execute(input);

    await expect(() => useCase.execute(input)).rejects.toThrowError(
      new WhitelabelAlreadyExistsError(input.name, Whitelabel),
    );
  });
});
