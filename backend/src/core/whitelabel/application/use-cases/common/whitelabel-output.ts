import { Whitelabel } from '../../../domain/whitelabel';

export type WhitelabelOutput = {
  whitelabel_id: string;
  name: string;
  url: string;
  created_at: Date;
  updated_at: Date;
};

export class WhitelabelOutputMapper {
  static toOutput(entity: Whitelabel): WhitelabelOutput {
    const { whitelabel_id, ...otherProps } = entity.toJSON();
    return {
      whitelabel_id,
      ...otherProps,
    };
  }
}
