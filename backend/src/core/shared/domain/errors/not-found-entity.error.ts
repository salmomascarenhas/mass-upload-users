import { Entity } from '../entity';

export class NotFoundEntityError extends Error {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    const idsMessage = Array.isArray(id) ? id.join(', ') : id;
    super(`Entity ${entityClass.name} Not Found using ID ${idsMessage}`);
    this.name = 'NotFoundEntityError';
  }
}
