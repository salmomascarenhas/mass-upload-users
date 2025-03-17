import { Entity } from '../../shared/domain/entity';
import { ValueObject } from '../../shared/domain/value-object';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { WhitelabelValidatorFactory } from './whitelabel.validator';

export class WhitelabelId extends Uuid {}

export type WhitelabelConstructorProps = {
  whitelabel_id?: WhitelabelId;
  name: string;
  url: string;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type WhitelabelCreateCommand = Omit<
  WhitelabelConstructorProps,
  'whitelabel_id' | 'created_at' | 'updated_at'
>;

export class Whitelabel extends Entity {
  whitelabel_id: WhitelabelId;
  name: string;
  url: string;
  created_at: Date;
  updated_at: Date;

  constructor(props: WhitelabelConstructorProps) {
    super();
    this.whitelabel_id = props.whitelabel_id || new WhitelabelId();
    this.name = props.name;
    this.url = props.url;
    this.created_at = props.created_at || new Date();
    this.updated_at = props.updated_at || new Date();
  }

  get entity_id(): ValueObject {
    return this.whitelabel_id;
  }

  static create(props: WhitelabelCreateCommand): Whitelabel {
    const whitelabel = new Whitelabel(props);
    whitelabel.validate();
    return whitelabel;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeUrl(url: string): void {
    this.url = url;
    this.validate(['url']);
  }

  validate(fields?: string[]) {
    const validator = WhitelabelValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  toJSON() {
    return {
      whitelabel_id: this.whitelabel_id.id,
      name: this.name,
      url: this.url,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
