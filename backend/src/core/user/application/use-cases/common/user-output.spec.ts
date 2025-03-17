import { CpfCnpj } from '../../../../shared/domain/value-objects/cpf-cnpj.vo';
import { User } from '../../../domain/user';
import { UserOutputMapper } from './user-output';

describe('UserOutputMapper Unit Tests', () => {
  it('should convert a user entity to output', () => {
    const entity = User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf_cnpj: new CpfCnpj('091.012.426-44'),
      whitelabel_id: 'whitelabel_id',
    });

    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = UserOutputMapper.toOutput(entity);

    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      user_id: entity.user_id.id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf_cnpj: '091.012.426-44',
      whitelabel_id: 'whitelabel_id',
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  });
});
