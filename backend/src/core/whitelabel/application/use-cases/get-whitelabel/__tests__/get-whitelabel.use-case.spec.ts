import { NotFoundEntityError } from '../../../../../shared/domain/errors/not-found-entity.error';
import { Whitelabel, WhitelabelId } from '../../../../domain/whitelabel';
import { WhitelabelInMemoryRepository } from '../../../../infra/db/in-memory/whitelabel-in-memory.repository';
import { GetWhitelabelUseCase } from '../get-whitelabel.use-case';

describe('GetWhitelabelUseCase Unit Tests', () => {
  let useCase: GetWhitelabelUseCase;
  let repository: WhitelabelInMemoryRepository;

  beforeEach(() => {
    repository = new WhitelabelInMemoryRepository();
    useCase = new GetWhitelabelUseCase(repository);
  });

  it('should throw error when whitelabel not found', async () => {
    const whitelabelId = new WhitelabelId();

    await expect(() =>
      useCase.execute({ whitelabel_id: whitelabelId.id }),
    ).rejects.toThrow(new NotFoundEntityError(whitelabelId.id, Whitelabel));
  });

  it('should return a whitelabel', async () => {
    const entity = new Whitelabel({
      name: 'My Club',
      url: 'https://myclub.com',
    });
    repository.items = [entity];

    const output = await useCase.execute({
      whitelabel_id: entity.whitelabel_id.id,
    });

    expect(output).toStrictEqual({
      whitelabel_id: entity.whitelabel_id.id,
      name: entity.name,
      url: entity.url,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  });
});
