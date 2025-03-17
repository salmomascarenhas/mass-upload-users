import { CpfCnpj } from '../../../shared/domain/value-objects/cpf-cnpj.vo';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { User, UserId } from '../user';

describe('User Unit Test', () => {
  beforeEach(() => {
    User.prototype.validate = jest
      .fn()
      .mockImplementation(User.prototype.validate);
  });

  describe('Constructor', () => {
    it('should test constructor with all values', () => {
      const createdAt = new Date();
      const updatedAt = new Date();
      const uuidString = '123e4567-e89b-12d3-a456-426655440000';
      const user = new User({
        user_id: new UserId(uuidString),
        name: 'John Doe',
        email: 'john@mail.com',
        cpf_cnpj: new CpfCnpj('68845736008'),
        whitelabel_id: new Uuid().id,
        created_at: createdAt,
        updated_at: updatedAt,
      });
      expect(user).toBeInstanceOf(User);
      expect(user.user_id.id).toBe(uuidString);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@mail.com');
      expect(user.cpf_cnpj.getFormatted()).toBe('688.457.360-08');
      expect(user.created_at).toBe(createdAt);
      expect(user.updated_at).toBe(updatedAt);
    });

    it('should test constructor with only required values', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@mail.com',
        cpf_cnpj: new CpfCnpj('68845736008'),
        whitelabel_id: new Uuid().id,
      });
      expect(user).toBeInstanceOf(User);
      expect(user.user_id).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@mail.com');
      expect(user.cpf_cnpj.getFormatted()).toBe('688.457.360-08');
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('Command', () => {
    it('should test create command', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@mail.com',
        cpf_cnpj: new CpfCnpj('68845736008'),
        whitelabel_id: new Uuid().id,
      });
      expect(user).toBeInstanceOf(User);
      expect(user.user_id).toBeInstanceOf(Uuid);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@mail.com');
      expect(user.cpf_cnpj.getFormatted()).toBe('688.457.360-08');
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
      expect(User.prototype.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Methods', () => {
    it('should test change full name', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@mail.com',
        cpf_cnpj: new CpfCnpj('68845736008'),
        whitelabel_id: new Uuid().id,
      });

      user.changeFullName('Jane Doe');
      expect(user.name).toBe('Jane Doe');
      expect(User.prototype.validate).toHaveBeenCalledTimes(2);
    });

    it('should test change email', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@mail.com',
        cpf_cnpj: new CpfCnpj('68845736008'),
        whitelabel_id: new Uuid().id,
      });

      user.changeEmail('jane@mail.com');
      expect(user.email).toBe('jane@mail.com');
      expect(User.prototype.validate).toHaveBeenCalledTimes(2);
    });

    it('should test toJSON', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@mail.com',
        cpf_cnpj: new CpfCnpj('68845736008'),
        whitelabel_id: new Uuid().id,
      });

      expect(user.toJSON()).toEqual({
        user_id: user.user_id.id,
        name: user.name,
        email: user.email,
        cpf_cnpj: user.cpf_cnpj.getFormatted(),
        whitelabel_id: user.whitelabel_id,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    });
  });
});
