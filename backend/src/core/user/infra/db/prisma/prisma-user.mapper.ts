import { Users as PrismaUser } from '@prisma/client';
import { CpfCnpj } from '../../../../shared/domain/value-objects/cpf-cnpj.vo';
import { WhitelabelId } from '../../../../whitelabel/domain/whitelabel';
import { User, UserId } from '../../../domain/user';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return new User({
      user_id: new UserId(raw.id),
      name: raw.name,
      email: raw.email,
      cpf_cnpj: new CpfCnpj(raw.cpfCnpj),
      whitelabel_id: new WhitelabelId(raw.whitelabelId),
      created_at: raw.createdAt,
      updated_at: raw.updatedAt,
    });
  }

  static toPrisma(user: User): PrismaUser {
    return {
      id: user.user_id.toString(),
      name: user.name,
      email: user.email,
      cpfCnpj: user.cpf_cnpj.value,
      whitelabelId: user.whitelabel_id.toString(),
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}
