import { Whitelabel, WhitelabelId } from '../whitelabel';

describe('Whitelabel Unit Test', () => {
  beforeEach(() => {
    Whitelabel.prototype.validate = jest
      .fn()
      .mockImplementation(Whitelabel.prototype.validate);
  });

  describe('Constructor', () => {
    it('should test constructor with all values', () => {
      const createdAt = new Date();
      const updatedAt = new Date();
      const uuidString = '123e4567-e89b-12d3-a456-426655440000';
      const whitelabel = new Whitelabel({
        whitelabel_id: new WhitelabelId(uuidString),
        name: 'Test Whitelabel',
        url: 'https://test.com',
        created_at: createdAt,
        updated_at: updatedAt,
      });
      expect(whitelabel).toBeInstanceOf(Whitelabel);
      expect(whitelabel.whitelabel_id.toString()).toBe(uuidString);
      expect(whitelabel.name).toBe('Test Whitelabel');
      expect(whitelabel.url).toBe('https://test.com');
      expect(whitelabel.created_at).toBe(createdAt);
      expect(whitelabel.updated_at).toBe(updatedAt);
    });

    it('should test constructor with only required values', () => {
      const whitelabel = new Whitelabel({
        name: 'Test Whitelabel',
        url: 'https://test.com',
      });
      expect(whitelabel).toBeInstanceOf(Whitelabel);
      expect(whitelabel.whitelabel_id).toBeDefined();
      expect(whitelabel.name).toBe('Test Whitelabel');
      expect(whitelabel.url).toBe('https://test.com');
      expect(whitelabel.created_at).toBeInstanceOf(Date);
      expect(whitelabel.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('Methods', () => {
    it('should test change name', () => {
      const whitelabel = Whitelabel.create({
        name: 'Test Whitelabel',
        url: 'https://test.com',
      });

      whitelabel.changeName('Updated Whitelabel');
      expect(whitelabel.name).toBe('Updated Whitelabel');
      expect(Whitelabel.prototype.validate).toHaveBeenCalledTimes(2);
    });

    it('should test change url', () => {
      const whitelabel = Whitelabel.create({
        name: 'Test Whitelabel',
        url: 'https://test.com',
      });

      whitelabel.changeUrl('https://updated.com');
      expect(whitelabel.url).toBe('https://updated.com');
      expect(Whitelabel.prototype.validate).toHaveBeenCalledTimes(2);
    });

    it('should test toJSON', () => {
      const whitelabel = Whitelabel.create({
        name: 'Test Whitelabel',
        url: 'https://test.com',
      });

      expect(whitelabel.toJSON()).toEqual({
        whitelabel_id: whitelabel.whitelabel_id.toString(),
        name: whitelabel.name,
        url: whitelabel.url,
        created_at: whitelabel.created_at,
        updated_at: whitelabel.updated_at,
      });
    });
  });
});
