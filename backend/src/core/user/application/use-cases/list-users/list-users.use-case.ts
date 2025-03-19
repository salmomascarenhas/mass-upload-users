import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import {
  IUserRepository,
  UserFilter,
  UserSearchParams,
  UserSearchResult,
} from '../../../domain/user.repository';

import { UserOutput, UserOutputMapper } from '../common/user-output';

export class ListUsersUseCase
  implements IUseCase<ListUsersInput, ListUsersOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    const searchParams = new UserSearchParams({
      page: input.page ?? 1,
      per_page: input.perPage ?? 10,
      sort: input.sort ?? 'created_at',
      sort_dir: input.sortDir ?? 'desc',
      filter: input.filter ?? null,
    });

    const searchResult = await this.userRepository.search(searchParams);
    return this.toOutput(searchResult);
  }

  private toOutput(
    searchResult: UserSearchResult,
  ): PaginationOutput<UserOutput> {
    const items = searchResult.items.map(UserOutputMapper.toOutput);
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListUsersInput = {
  page?: number | null;
  perPage?: number | null;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: UserFilter | null;
};

export type ListUsersOutput = PaginationOutput<UserOutput>;
