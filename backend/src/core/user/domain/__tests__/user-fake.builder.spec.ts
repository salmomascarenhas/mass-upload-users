import { Chance } from 'chance';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { UserFakeBuilder } from '../user-fake.builder';

describe('UserFakeBuilder Unit Tests', () => {
  describe('user_id prop', () => {
    const faker = UserFakeBuilder.aUser();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.user_id).toThrow(
        new Error("Property user_id not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_user_id']).toBeUndefined();
    });

    test('withUserId', () => {
      const user_id = new Uuid();
      const $this = faker.withUserId(user_id);
      expect($this).toBeInstanceOf(UserFakeBuilder);
      expect(faker['_user_id']).toBe(user_id);
      faker.withUserId(() => user_id);
      //@ts-expect-error _user_id is a callable
      expect(faker['_user_id']()).toBe(user_id);
      expect(faker.user_id).toBe(user_id);
    });
  });

  describe('full_name prop', () => {
    const faker = UserFakeBuilder.aUser();
    test('should be a function', () => {
      expect(typeof faker['_full_name']).toBe('function');
    });

    test('should call the name method', () => {
      const chance = Chance();
      const spyNameMethod = jest.spyOn(chance, 'name');
      faker['chance'] = chance;
      faker.build();

      expect(spyNameMethod).toHaveBeenCalled();
    });
  });

  describe('email prop', () => {
    const faker = UserFakeBuilder.aUser();
    test('should be a function', () => {
      expect(typeof faker['_email']).toBe('function');
    });
  });

  describe('created_at prop', () => {
    const faker = UserFakeBuilder.aUser();

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(UserFakeBuilder);
      expect(faker['_created_at']).toBe(date);
    });
  });

  describe('updated_at prop', () => {
    const faker = UserFakeBuilder.aUser();

    test('should be undefined', () => {
      expect(faker['_updated_at']).toBeUndefined();
    });
  });
});
