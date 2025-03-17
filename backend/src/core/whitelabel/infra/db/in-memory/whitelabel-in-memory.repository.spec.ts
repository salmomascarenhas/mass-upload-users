import { Whitelabel, WhitelabelId } from '../../../domain/whitelabel';
import { WhitelabelInMemoryRepository } from './whitelabel-in-memory.repository';

describe('WhitelabelInMemoryRepository Unit Tests', () => {
  let repository: WhitelabelInMemoryRepository;

  beforeEach(() => {
    repository = new WhitelabelInMemoryRepository();
  });

  describe('findByName method', () => {
    it('should return null if no whitelabel is found', async () => {
      const result = await repository.findByName('Nonexistent');
      expect(result).toBeNull();
    });

    it('should find a whitelabel by name', async () => {
      const whitelabel = new Whitelabel({
        whitelabel_id: new WhitelabelId(),
        name: 'Test Whitelabel',
        url: 'test-url.com',
        created_at: new Date(),
        updated_at: new Date(),
      });

      repository.items.push(whitelabel);
      const result = await repository.findByName('Test Whitelabel');
      expect(result).toBe(whitelabel);
    });
  });

  describe('findByUrl method', () => {
    it('should return null if no whitelabel is found', async () => {
      const result = await repository.findByUrl('nonexistent-url.com');
      expect(result).toBeNull();
    });

    it('should find a whitelabel by URL', async () => {
      const whitelabel = new Whitelabel({
        whitelabel_id: new WhitelabelId(),
        name: 'Test Whitelabel',
        url: 'test-url.com',
        created_at: new Date(),
        updated_at: new Date(),
      });

      repository.items.push(whitelabel);
      const result = await repository.findByUrl('test-url.com');
      expect(result).toBe(whitelabel);
    });
  });

  describe('applyFilter method', () => {
    it('should return all items if filter is null', async () => {
      const items = [
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Alpha',
          url: 'alpha.com',
          created_at: new Date(),
          updated_at: new Date(),
        }),
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Beta',
          url: 'beta.com',
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ];

      repository.items = items;
      const filteredItems = await repository['applyFilter'](items, null);
      expect(filteredItems).toEqual(items);
    });

    it('should filter items by name or URL', async () => {
      const items = [
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Alpha',
          url: 'alpha.com',
          created_at: new Date(),
          updated_at: new Date(),
        }),
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Beta',
          url: 'beta.com',
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ];

      repository.items = items;
      let filteredItems = await repository['applyFilter'](items, 'Alpha');
      expect(filteredItems).toEqual([items[0]]);

      filteredItems = await repository['applyFilter'](items, 'beta.com');
      expect(filteredItems).toEqual([items[1]]);
    });
  });

  describe('applySort method', () => {
    it('should sort items by name in descending order by default', async () => {
      const items = [
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Alpha',
          url: 'alpha.com',
          created_at: new Date(),
          updated_at: new Date(),
        }),
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Beta',
          url: 'beta.com',
          created_at: new Date(),
          updated_at: new Date(),
        }),
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Gamma',
          url: 'gamma.com',
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ];

      repository.items = items;
      const sortedItems = await repository['applySort'](items, null, null);
      expect(sortedItems).toEqual([items[2], items[1], items[0]]);
    });

    it('should sort items by specified field and direction', async () => {
      const items = [
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Alpha',
          url: 'alpha.com',
          created_at: new Date('2024-08-01T12:00:00Z'),
          updated_at: new Date(),
        }),
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Beta',
          url: 'beta.com',
          created_at: new Date('2024-08-02T12:00:00Z'),
          updated_at: new Date(),
        }),
        new Whitelabel({
          whitelabel_id: new WhitelabelId(),
          name: 'Gamma',
          url: 'gamma.com',
          created_at: new Date('2024-08-03T12:00:00Z'),
          updated_at: new Date(),
        }),
      ];

      repository.items = items;

      let sortedItems = await repository['applySort'](
        items,
        'created_at',
        'asc',
      );
      expect(sortedItems).toEqual([items[0], items[1], items[2]]);

      sortedItems = await repository['applySort'](items, 'created_at', 'desc');
      expect(sortedItems).toEqual([items[2], items[1], items[0]]);
    });
  });
});
