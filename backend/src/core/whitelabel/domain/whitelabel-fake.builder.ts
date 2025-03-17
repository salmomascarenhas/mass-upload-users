import { Chance } from 'chance';
import {
  Whitelabel,
  WhitelabelConstructorProps,
  WhitelabelId,
} from './whitelabel';

type PropOrFactory<T> = T | ((index: number) => T);

export class WhitelabelFakeBuilder<TBuild = any> {
  private _whitelabel_id: PropOrFactory<WhitelabelId> | undefined = undefined;
  private _name: PropOrFactory<string> = (_index) => this.chance.company();
  private _url: PropOrFactory<string> = (_index) => this.chance.url();
  private _created_at: PropOrFactory<Date | null> | undefined = undefined;
  private _updated_at: PropOrFactory<Date | null> | undefined = undefined;

  private countObjs;
  private chance: Chance.Chance;

  static aWhitelabel() {
    return new WhitelabelFakeBuilder<Whitelabel>();
  }

  static theWhitelabels(countObjs: number) {
    return new WhitelabelFakeBuilder<Whitelabel[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  withWhitelabelId(valueOrFactory: PropOrFactory<WhitelabelId>) {
    this._whitelabel_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withUrl(valueOrFactory: PropOrFactory<string>) {
    this._url = valueOrFactory;
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
    const whitelabels = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const whitelabelProps: WhitelabelConstructorProps = {
          whitelabel_id: !this._whitelabel_id
            ? undefined
            : this.callFactory(this._whitelabel_id, index),
          name: this.callFactory(this._name, index),
          url: this.callFactory(this._url, index),
          created_at: this.callFactory(this._created_at, index),
          updated_at: this.callFactory(this._updated_at, index),
        };
        const whitelabel = new Whitelabel(whitelabelProps);
        whitelabel.validate();
        return whitelabel;
      });
    return this.countObjs === 1
      ? (whitelabels[0] as any)
      : (whitelabels as any);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
