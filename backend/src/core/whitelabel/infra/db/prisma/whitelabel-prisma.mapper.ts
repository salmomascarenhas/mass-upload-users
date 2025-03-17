import { Whitelabel as PrismaWhitelabel } from '@prisma/client';
import { Whitelabel, WhitelabelId } from '../../../domain/whitelabel';

export class PrismaWhitelabelMapper {
  static toDomain(raw: PrismaWhitelabel): Whitelabel {
    return new Whitelabel({
      whitelabel_id: new WhitelabelId(raw.id),
      name: raw.name,
      url: raw.url,
      created_at: raw.createdAt,
      updated_at: raw.updatedAt,
    });
  }

  static toPrisma(whitelabel: Whitelabel): PrismaWhitelabel {
    return {
      id: whitelabel.whitelabel_id.id,
      name: whitelabel.name,
      url: whitelabel.url,
      createdAt: whitelabel.created_at,
      updatedAt: whitelabel.updated_at,
    };
  }
}
