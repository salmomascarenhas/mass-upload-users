import { Entity } from '../../../shared/domain/entity';

export class WhitelabelNameAlreadyExistsError extends Error {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    const idsMessage = Array.isArray(id) ? id.join(', ') : id;
    super(`Whitelabel Name Already Exists using ID ${idsMessage}`);
    this.name = 'WhitelabelNameAlreadyExistsError';
  }
}
