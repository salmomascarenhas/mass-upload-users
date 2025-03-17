import { User } from '../../../domain/user';

export type UserOutput = {
  user_id: string;
  name: string;
  cpf_cnpj: string;
  email: string;
  whitelabel_id: string;
  created_at: Date;
  updated_at: Date;
};

export class UserOutputMapper {
  static toOutput(entity: User): UserOutput {
    const { user_id, ...otherProps } = entity.toJSON();
    return {
      user_id,
      ...otherProps,
    };
  }
}
