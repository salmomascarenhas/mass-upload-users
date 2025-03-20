import { PrismaService } from '../../../../../nestjs-modules/shared/database/prisma/prisma.service';
import { InvalidArgumentError } from '../../../../shared/domain/errors/invalid-argument.error';
import { NotFoundEntityError } from '../../../../shared/domain/errors/not-found-entity.error';
import { CpfCnpj } from '../../../../shared/domain/value-objects/cpf-cnpj.vo';
import { User, UserId } from '../../../domain/user';
import {
  IUserRepository,
  UserSearchParams,
  UserSearchResult,
} from '../../../domain/user.repository';
import { PrismaUserMapper } from './prisma-user.mapper';

export class UserPrismaRepository implements IUserRepository {
  sortableFields: string[] = ['name', 'email', 'createdAt', 'updatedAt'];

  constructor(private readonly prisma: PrismaService) {}

  async findByCpfCnpj(cpfCnpj: CpfCnpj): Promise<User | null> {
    const model = await this.prisma.users.findFirst({
      where: { cpfCnpj: cpfCnpj.value },
    });
    return model ? PrismaUserMapper.toDomain(model) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.prisma.users.findFirst({ where: { email } });
    return model ? PrismaUserMapper.toDomain(model) : null;
  }

  async insert(entity: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(entity);
    await this.prisma.users.create({ data });
  }

  async bulkInsert(entities: User[]): Promise<void> {
    const data = entities.map(PrismaUserMapper.toPrisma);
    await this.prisma.users.createMany({ data });
  }

  async update(entity: User): Promise<void> {
    const id = entity.user_id.toString();
    const data = PrismaUserMapper.toPrisma(entity);
    const updated = await this.prisma.users.update({
      where: { id },
      data,
    });
    if (!updated) throw new NotFoundEntityError(id, this.getEntity());
  }

  async delete(entity_id: UserId): Promise<void> {
    const id = entity_id.toString();
    try {
      await this.prisma.users.delete({ where: { id } });
    } catch {
      throw new NotFoundEntityError(id, this.getEntity());
    }
  }

  async findById(entity_id: UserId): Promise<User | null> {
    const model = await this.prisma.users.findUnique({
      where: { id: entity_id.toString() },
    });
    return model ? PrismaUserMapper.toDomain(model) : null;
  }

  async findAll(): Promise<User[]> {
    const models = await this.prisma.users.findMany();
    return models.map(PrismaUserMapper.toDomain);
  }

  async findByIds(ids: UserId[]): Promise<User[]> {
    const models = await this.prisma.users.findMany({
      where: { id: { in: ids.map((id) => id.toString()) } },
    });
    return models.map(PrismaUserMapper.toDomain);
  }

  async existsById(
    ids: UserId[],
  ): Promise<{ exists: UserId[]; not_exists: UserId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    const existingModels = await this.prisma.users.findMany({
      where: { id: { in: ids.map((id) => id.toString()) } },
      select: { id: true },
    });

    const existingIds = existingModels.map((model) => new UserId(model.id));
    const notExistingIds = ids.filter(
      (id) => !existingIds.some((exists) => exists.equals(id)),
    );

    return {
      exists: existingIds,
      not_exists: notExistingIds,
    };
  }

  async search(props: UserSearchParams): Promise<UserSearchResult> {
    const offset = (props.page - 1) * props.per_page;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.users.findMany({
        skip: offset,
        take: props.per_page,
        where: props.filter
          ? {
              OR: [
                { name: { contains: props.filter, mode: 'insensitive' } },
                { email: { contains: props.filter, mode: 'insensitive' } },
              ],
            }
          : undefined,
        orderBy:
          props.sort && this.sortableFields.includes(props.sort)
            ? [{ [props.sort]: props.sort_dir ?? 'asc' }]
            : [{ createdAt: 'desc' }],
      }),
      this.prisma.users.count({
        where: props.filter
          ? {
              OR: [
                { name: { contains: props.filter, mode: 'insensitive' } },
                { email: { contains: props.filter, mode: 'insensitive' } },
              ],
            }
          : undefined,
      }),
    ]);

    return new UserSearchResult({
      items: items.map(PrismaUserMapper.toDomain),
      current_page: props.page,
      per_page: props.per_page,
      total,
    });
  }

  getEntity(): new (...args: any[]) => User {
    return User;
  }
}
