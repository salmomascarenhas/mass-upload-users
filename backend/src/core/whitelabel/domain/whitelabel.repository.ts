import { ISearchableRepository } from '../../shared/domain/repository/repository.interface';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { Whitelabel, WhitelabelId } from './whitelabel';

export type WhitelabelFilter = string;

export class WhitelabelSearchParams extends SearchParams<WhitelabelFilter> {}

export class WhitelabelSearchResult extends SearchResult<Whitelabel> {}

export interface IWhitelabelRepository
  extends ISearchableRepository<
    Whitelabel,
    WhitelabelId,
    WhitelabelFilter,
    WhitelabelSearchParams,
    WhitelabelSearchResult
  > {
  findByName(name: string): Promise<Whitelabel | null>;
  findByUrl(url: string): Promise<Whitelabel | null>;
}
