import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import {
  IWhitelabelRepository,
  WhitelabelFilter,
  WhitelabelSearchParams,
  WhitelabelSearchResult,
} from '../../../domain/whitelabel.repository';
import {
  WhitelabelOutput,
  WhitelabelOutputMapper,
} from '../common/whitelabel-output';

export class ListWhitelabelsUseCase
  implements IUseCase<ListWhitelabelsInput, ListWhitelabelsOutput>
{
  constructor(private readonly whitelabelRepository: IWhitelabelRepository) {}

  async execute(input: ListWhitelabelsInput): Promise<ListWhitelabelsOutput> {
    const searchParams = new WhitelabelSearchParams({
      page: input.page ?? 1,
      per_page: input.perPage ?? 10,
      sort: input.sort ?? 'created_at',
      sort_dir: input.sortDir ?? 'desc',
      filter: input.filter ?? null,
    });

    const searchResult = await this.whitelabelRepository.search(searchParams);
    return this.toOutput(searchResult);
  }

  private toOutput(
    searchResult: WhitelabelSearchResult,
  ): PaginationOutput<WhitelabelOutput> {
    const items = searchResult.items.map(WhitelabelOutputMapper.toOutput);
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListWhitelabelsInput = {
  page?: number | undefined | null;
  perPage?: number | undefined | null;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: WhitelabelFilter | null;
};

export type ListWhitelabelsOutput = PaginationOutput<WhitelabelOutput>;
