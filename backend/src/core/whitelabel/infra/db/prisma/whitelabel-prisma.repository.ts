import { PrismaService } from '../../../../../nestjs-modules/database/prisma/prisma.service';
import { InvalidArgumentError } from '../../../../shared/domain/errors/invalid-argument.error';
import { NotFoundEntityError } from '../../../../shared/domain/errors/not-found-entity.error';
import { Whitelabel, WhitelabelId } from '../../../domain/whitelabel';
import {
  IWhitelabelRepository,
  WhitelabelSearchParams,
  WhitelabelSearchResult,
} from '../../../domain/whitelabel.repository';
import { PrismaWhitelabelMapper } from './whitelabel-prisma.mapper';

export class WhitelabelPrismaRepository implements IWhitelabelRepository {
  sortableFields: string[] = ['name', 'url', 'createdAt', 'updatedAt'];

  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<Whitelabel | null> {
    const model = await this.prisma.whitelabel.findFirst({ where: { name } });
    return model ? PrismaWhitelabelMapper.toDomain(model) : null;
  }

  async findByUrl(url: string): Promise<Whitelabel | null> {
    const model = await this.prisma.whitelabel.findFirst({ where: { url } });
    return model ? PrismaWhitelabelMapper.toDomain(model) : null;
  }

  async insert(entity: Whitelabel): Promise<void> {
    const data = PrismaWhitelabelMapper.toPrisma(entity);
    await this.prisma.whitelabel.create({ data });
  }

  async bulkInsert(entities: Whitelabel[]): Promise<void> {
    const data = entities.map(PrismaWhitelabelMapper.toPrisma);
    await this.prisma.whitelabel.createMany({ data });
  }

  async update(entity: Whitelabel): Promise<void> {
    const id = entity.whitelabel_id.id;
    const data = PrismaWhitelabelMapper.toPrisma(entity);
    const updated = await this.prisma.whitelabel.update({
      where: { id },
      data,
    });

    if (!updated) throw new NotFoundEntityError(id, this.getEntity());
  }

  async delete(entity_id: WhitelabelId): Promise<void> {
    const id = entity_id.id;
    try {
      await this.prisma.whitelabel.delete({ where: { id } });
    } catch {
      throw new NotFoundEntityError(id, this.getEntity());
    }
  }

  async findById(entity_id: WhitelabelId): Promise<Whitelabel | null> {
    const model = await this.prisma.whitelabel.findUnique({
      where: { id: entity_id.id },
    });
    return model ? PrismaWhitelabelMapper.toDomain(model) : null;
  }

  async findAll(): Promise<Whitelabel[]> {
    const models = await this.prisma.whitelabel.findMany();
    return models.map(PrismaWhitelabelMapper.toDomain);
  }

  async findByIds(ids: WhitelabelId[]): Promise<Whitelabel[]> {
    const models = await this.prisma.whitelabel.findMany({
      where: { id: { in: ids.map((id) => id.id) } },
    });
    return models.map(PrismaWhitelabelMapper.toDomain);
  }

  async existsById(
    ids: WhitelabelId[],
  ): Promise<{ exists: WhitelabelId[]; not_exists: WhitelabelId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    const existingModels = await this.prisma.whitelabel.findMany({
      where: { id: { in: ids.map((id) => id.id) } },
      select: { id: true },
    });

    const existingIds = existingModels.map(
      (model) => new WhitelabelId(model.id),
    );
    const notExistingIds = ids.filter(
      (id) => !existingIds.some((exists) => exists.equals(id)),
    );

    return {
      exists: existingIds,
      not_exists: notExistingIds,
    };
  }

  async search(props: WhitelabelSearchParams): Promise<WhitelabelSearchResult> {
    const offset = (props.page - 1) * props.per_page;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.whitelabel.findMany({
        skip: offset,
        take: props.per_page,
        where: props.filter
          ? {
              OR: [
                { name: { contains: props.filter, mode: 'insensitive' } },
                { url: { contains: props.filter, mode: 'insensitive' } },
              ],
            }
          : undefined,
        orderBy:
          props.sort && this.sortableFields.includes(props.sort)
            ? [{ [props.sort]: props.sort_dir ?? 'asc' }]
            : [{ createdAt: 'desc' }],
      }),
      this.prisma.whitelabel.count({
        where: props.filter
          ? {
              OR: [
                { name: { contains: props.filter, mode: 'insensitive' } },
                { url: { contains: props.filter, mode: 'insensitive' } },
              ],
            }
          : undefined,
      }),
    ]);

    return new WhitelabelSearchResult({
      items: items.map(PrismaWhitelabelMapper.toDomain),
      current_page: props.page,
      per_page: props.per_page,
      total,
    });
  }

  getEntity(): new (...args: any[]) => Whitelabel {
    return Whitelabel;
  }
}
