import { Chance } from 'chance';
import { CpfCnpj } from '../../shared/domain/value-objects/cpf-cnpj.vo';
import { User, UserConstructorProps, UserId } from './user';

type PropOrFactory<T> = T | ((index: number) => T);

export class UserFakeBuilder<TBuild = any> {
  private _user_id: PropOrFactory<UserId> | undefined = undefined;
  private _name: PropOrFactory<string> = (_index) => this.chance.name();
  private _email: PropOrFactory<string> = (_index) => this.chance.email();
  private _cpf_cnpj: PropOrFactory<CpfCnpj> = (_index) =>
    new CpfCnpj(this.chance.cpf());
  private _whitelabel_id: PropOrFactory<string> = (_index) =>
    this.chance.guid();
  private _created_at: PropOrFactory<Date | null> | undefined = undefined;
  private _updated_at: PropOrFactory<Date | null> | undefined = undefined;

  private countObjs;
  private chance: Chance.Chance;

  static aUser() {
    return new UserFakeBuilder<User>();
  }

  static theUsers(countObjs: number) {
    return new UserFakeBuilder<User[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  withUserId(valueOrFactory: PropOrFactory<UserId>) {
    this._user_id = valueOrFactory;
    return this;
  }

  withFullName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withEmail(valueOrFactory: PropOrFactory<string>) {
    this._email = valueOrFactory;
    return this;
  }

  withCpfCnpj(valueOrFactory: PropOrFactory<CpfCnpj>) {
    this._cpf_cnpj = valueOrFactory;
    return this;
  }

  withWhitelabelId(valueOrFactory: PropOrFactory<string>) {
    this._whitelabel_id = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date | null>) {
    this._created_at = valueOrFactory;
    return this;
  }

  withUpdatedAt(valueOrFactory: PropOrFactory<Date | null>) {
    this._updated_at = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const users = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const userProps: UserConstructorProps = {
        user_id: !this._user_id
          ? undefined
          : this.callFactory(this._user_id, index),
        name: this.callFactory(this._name, index),
        email: this.callFactory(this._email, index),
        cpf_cnpj: this.callFactory(this._cpf_cnpj, index),
        whitelabel_id: this.callFactory(this._whitelabel_id, index),
        created_at: this.callFactory(this._created_at, index),
        updated_at: this.callFactory(this._updated_at, index),
      };
      const user = new User(userProps);
      user.validate();
      return user;
    });
    return this.countObjs === 1 ? (users[0] as any) : (users as any);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
