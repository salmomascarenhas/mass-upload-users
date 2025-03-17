import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { Whitelabel, WhitelabelId } from '../../../domain/whitelabel';
import {
  IWhitelabelRepository,
  WhitelabelFilter,
} from '../../../domain/whitelabel.repository';

export class WhitelabelInMemoryRepository
  extends InMemorySearchableRepository<Whitelabel, WhitelabelId>
  implements IWhitelabelRepository
{
  async findByName(name: string): Promise<Whitelabel | null> {
    return (
      this.items.find(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      ) || null
    );
  }

  async findByUrl(url: string): Promise<Whitelabel | null> {
    return (
      this.items.find((item) => item.url.toLowerCase() === url.toLowerCase()) ||
      null
    );
  }

  sortableFields: string[] = ['name', 'url', 'created_at', 'updated_at'];

  protected async applyFilter(
    items: Whitelabel[],
    filter: WhitelabelFilter,
  ): Promise<Whitelabel[]> {
    if (!filter) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.url.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  getEntity(): new (...args: any[]) => Whitelabel {
    return Whitelabel;
  }

  protected applySort(
    items: Whitelabel[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): Whitelabel[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'name', 'desc');
  }
}
