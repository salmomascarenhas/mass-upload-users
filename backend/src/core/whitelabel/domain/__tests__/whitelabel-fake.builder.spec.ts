import { Chance } from 'chance';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { WhitelabelFakeBuilder } from '../whitelabel-fake.builder';

describe('WhitelabelFakeBuilder Unit Tests', () => {
  describe('whitelabel_id prop', () => {
    const faker = WhitelabelFakeBuilder.aWhitelabel();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.whitelabel_id).toThrow(
        new Error(
          "Property whitelabel_id not have a factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined', () => {
      expect(faker['_whitelabel_id']).toBeUndefined();
    });

    test('withWhitelabelId', () => {
      const whitelabel_id = new Uuid();
      const $this = faker.withWhitelabelId(whitelabel_id);
      expect($this).toBeInstanceOf(WhitelabelFakeBuilder);
      expect(faker['_whitelabel_id']).toBe(whitelabel_id);
      faker.withWhitelabelId(() => whitelabel_id);
      //@ts-expect-error _whitelabel_id is a callable
      expect(faker['_whitelabel_id']()).toBe(whitelabel_id);
      expect(faker.whitelabel_id).toBe(whitelabel_id);
    });
  });

  describe('name prop', () => {
    const faker = WhitelabelFakeBuilder.aWhitelabel();
    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the name method', () => {
      const chance = Chance();
      const spyNameMethod = jest.spyOn(chance, 'company');
      faker['chance'] = chance;
      faker.build();

      expect(spyNameMethod).toHaveBeenCalled();
    });
  });

  describe('url prop', () => {
    const faker = WhitelabelFakeBuilder.aWhitelabel();
    test('should be a function', () => {
      expect(typeof faker['_url']).toBe('function');
    });
  });

  describe('created_at prop', () => {
    const faker = WhitelabelFakeBuilder.aWhitelabel();

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(WhitelabelFakeBuilder);
      expect(faker['_created_at']).toBe(date);
    });
  });

  describe('updated_at prop', () => {
    const faker = WhitelabelFakeBuilder.aWhitelabel();

    test('should be undefined', () => {
      expect(faker['_updated_at']).toBeUndefined();
    });
  });
});
