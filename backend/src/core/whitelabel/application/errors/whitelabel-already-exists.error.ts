import { Entity } from '../../../shared/domain/entity';

export class WhitelabelAlreadyExistsError extends Error {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    const idsMessage = Array.isArray(id) ? id.join(', ') : id;
    super(`Entity ${entityClass.name} Already Exists using ID ${idsMessage}`);
    this.name = 'WhitelabelAlreadyExistsError';
  }
}
