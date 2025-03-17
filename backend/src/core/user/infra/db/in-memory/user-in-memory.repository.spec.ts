import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { CpfCnpj } from '../../../../shared/domain/value-objects/cpf-cnpj.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { User, UserId } from '../../../domain/user';
import { IUserRepository } from '../../../domain/user.repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<User, UserId>
  implements IUserRepository
{
  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((item) => item.email === email) || null;
  }

  async findByCpfCnpj(cpfCnpj: CpfCnpj): Promise<User | null> {
    return this.items.find((item) => item.cpf_cnpj.equals(cpfCnpj)) || null;
  }

  sortableFields: string[] = ['name', 'email', 'created_at', 'updated_at'];

  protected async applyFilter(
    items: User[],
    filter: string | null,
  ): Promise<User[]> {
    if (!filter) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.email.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  getEntity(): new (...args: any[]) => User {
    return User;
  }

  protected applySort(
    items: User[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): User[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'full_name', 'desc');
  }
}
