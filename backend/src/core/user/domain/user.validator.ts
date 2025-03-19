import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/domain/validators/notification';
import { User } from './user';

export class UserRules {
  @MaxLength(255, { groups: ['name'] })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { groups: ['email'] })
  @IsNotEmpty()
  email: string;

  constructor(entity: User) {
    Object.assign(this, entity);
  }
}

export class UserValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['name', 'email', 'cpf_cnpj'];
    return super.validate(notification, new UserRules(data), newFields);
  }
}

export class UserValidatorFactory {
  static create() {
    return new UserValidator();
  }
}
