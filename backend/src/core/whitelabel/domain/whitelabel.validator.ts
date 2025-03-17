import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/domain/validators/notification';
import { Whitelabel } from './whitelabel';

export class WhitelabelRules {
  @MaxLength(255, { groups: ['name'] })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl({}, { groups: ['url'] })
  @IsNotEmpty()
  url: string;

  constructor(entity: Whitelabel) {
    Object.assign(this, entity);
  }
}

export class WhitelabelValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['name', 'url'];
    return super.validate(notification, new WhitelabelRules(data), newFields);
  }
}

export class WhitelabelValidatorFactory {
  static create() {
    return new WhitelabelValidator();
  }
}
