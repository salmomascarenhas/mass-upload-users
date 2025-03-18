import { ISearchableRepository } from '../../shared/domain/repository/repository.interface';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { CpfCnpj } from '../../shared/domain/value-objects/cpf-cnpj.vo';
import { WhitelabelId } from '../../whitelabel/domain/whitelabel';
import { User, UserId } from './user';

export type UserFilter = string;

export class UserSearchParams extends SearchParams<UserFilter> {}

export class UserSearchResult extends SearchResult<User> {}

export interface IUserRepository
  extends ISearchableRepository<
    User,
    UserId,
    UserFilter,
    UserSearchParams,
    UserSearchResult
  > {
  findByCpfCnpj(
    cpfCnpj: CpfCnpj,
    whitelabelId: WhitelabelId,
  ): Promise<User | null>;
  findByEmail(email: string, whitelabelId: WhitelabelId): Promise<User | null>;
}
