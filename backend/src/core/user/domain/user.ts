import { Entity } from '../../shared/domain/entity';
import { ValueObject } from '../../shared/domain/value-object';
import { CpfCnpj } from '../../shared/domain/value-objects/cpf-cnpj.vo';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { UserFakeBuilder } from './user-fake.builder';
import { UserValidatorFactory } from './user.validator';

export class UserId extends Uuid {}

export type UserConstructorProps = {
  user_id?: UserId;
  name: string;
  email: string;
  cpf_cnpj: CpfCnpj;
  whitelabel_id: string;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type UserCreateCommand = Omit<
  UserConstructorProps,
  'user_id' | 'created_at' | 'updated_at'
>;

export class User extends Entity {
  user_id: UserId;
  name: string;
  email: string;
  cpf_cnpj: CpfCnpj;
  whitelabel_id: string;
  created_at: Date;
  updated_at: Date;

  constructor(props: UserConstructorProps) {
    super();
    this.user_id = props.user_id || new UserId();
    this.name = props.name;
    this.email = props.email;
    this.cpf_cnpj = props.cpf_cnpj;
    this.whitelabel_id = props.whitelabel_id;
    this.created_at = props.created_at || new Date();
    this.updated_at = props.updated_at || new Date();
  }

  get entity_id(): ValueObject {
    return this.user_id;
  }

  static create(props: UserCreateCommand): User {
    const user = new User(props);
    user.validate();
    return user;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeEmail(email: string): void {
    this.email = email;
    this.validate(['email']);
  }

  changeCpfCnpj(cpf_cnpj: CpfCnpj): void {
    this.cpf_cnpj = cpf_cnpj;
  }

  validate(fields?: string[]) {
    const validator = UserValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return UserFakeBuilder;
  }

  toJSON() {
    return {
      user_id: this.user_id.id,
      name: this.name,
      email: this.email,
      cpf_cnpj: this.cpf_cnpj.getFormatted(),
      whitelabel_id: this.whitelabel_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
