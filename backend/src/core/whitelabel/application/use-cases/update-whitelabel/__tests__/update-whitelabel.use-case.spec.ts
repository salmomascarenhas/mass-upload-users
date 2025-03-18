import { Whitelabel } from '../../../../domain/whitelabel';
import { WhitelabelInMemoryRepository } from '../../../../infra/db/in-memory/whitelabel-in-memory.repository';
import { UpdateWhitelabelUseCase } from '../update-whitelabel.use-case';

describe('UpdateWhitelabelUseCase Unit Tests', () => {
  let useCase: UpdateWhitelabelUseCase;
  let repository: WhitelabelInMemoryRepository;

  beforeEach(() => {
    repository = new WhitelabelInMemoryRepository();
    useCase = new UpdateWhitelabelUseCase(repository);
  });

  it('should update a whitelabel', async () => {
    const entity = new Whitelabel({
      name: 'My Club',
      url: 'https://myclub.com',
    });
    repository.items = [entity];

    const output = await useCase.execute({
      whitelabel_id: entity.whitelabel_id.id,
      name: 'Updated Club',
    });

    expect(output.name).toBe('Updated Club');
  });
});
