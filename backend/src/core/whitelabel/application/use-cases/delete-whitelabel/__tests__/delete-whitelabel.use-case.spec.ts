import { NotFoundEntityError } from '../../../../../shared/domain/errors/not-found-entity.error';
import { Whitelabel, WhitelabelId } from '../../../../domain/whitelabel';
import { WhitelabelInMemoryRepository } from '../../../../infra/db/in-memory/whitelabel-in-memory.repository';
import { DeleteWhitelabelUseCase } from '../delete-whitelabel.use-case';

describe('DeleteWhitelabelUseCase Unit Tests', () => {
  let useCase: DeleteWhitelabelUseCase;
  let repository: WhitelabelInMemoryRepository;

  beforeEach(() => {
    repository = new WhitelabelInMemoryRepository();
    useCase = new DeleteWhitelabelUseCase(repository);
  });

  it('should throw an error if whitelabel not found', async () => {
    const whitelabelId = new WhitelabelId();

    await expect(() =>
      useCase.execute({ whitelabel_id: whitelabelId.id }),
    ).rejects.toThrow(new NotFoundEntityError(whitelabelId.id, Whitelabel));
  });

  it('should delete a whitelabel', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');
    const entity = new Whitelabel({
      name: 'My Club',
      url: 'https://myclub.com',
    });
    repository.items = [entity];

    await useCase.execute({ whitelabel_id: entity.whitelabel_id.id });

    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(repository.items.length).toBe(0);
  });
});
