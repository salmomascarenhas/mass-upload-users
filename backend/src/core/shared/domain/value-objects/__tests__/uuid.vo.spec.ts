import { validate as uuidValidate } from 'uuid';
import { Uuid, InvalidUuidError } from '../uuid.vo';

describe('Uuid Value Object Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');
  it('should throw error when uuid is invalid', () => {
    expect(() => new Uuid('invalid-')).toThrow(InvalidUuidError);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should accept a valid uuid', () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should accept a valid uuid', () => {
    const uuidString = '123e4567-e89b-12d3-a456-426655440000';
    const uuid = new Uuid(uuidString);
    expect(uuid.id).toBe(uuidString);
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
