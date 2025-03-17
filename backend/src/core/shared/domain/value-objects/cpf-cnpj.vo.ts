import { ValueObject } from '../value-object';

export class CpfCnpj extends ValueObject {
  readonly value: string;

  constructor(cpfCnpj: string) {
    super();
    this.value = cpfCnpj.replace(/\D/g, '');
    this.validate();
  }

  private validate() {
    if (!this.isValidFormat()) throw new InvalidCpfCnpjError();
    if (!this.isValidCpfCnpj()) throw new InvalidCpfCnpjError();
  }

  private isValidFormat(): boolean {
    return /^\d{11}$/.test(this.value) || /^\d{14}$/.test(this.value);
  }

  private isValidCpfCnpj(): boolean {
    return this.value.length === 11 ? this.isValidCpf() : this.isValidCnpj();
  }

  private isValidCpf(): boolean {
    if (this.isAllDigitsEqual()) return false;

    const cpfArray = this.value.split('').map(Number);

    const firstVerifier = this.calculateVerifierDigit(cpfArray.slice(0, 9));
    const secondVerifier = this.calculateVerifierDigit(
      cpfArray.slice(0, 9).concat(firstVerifier),
    );

    return firstVerifier === cpfArray[9] && secondVerifier === cpfArray[10];
  }

  private isAllDigitsEqual(): boolean {
    return this.value.split('').every((digit) => digit === this.value[0]);
  }

  private calculateVerifierDigit(numbers: number[]): number {
    const total = numbers.reduce((sum, digit, index) => {
      return sum + digit * (numbers.length + 1 - index);
    }, 0);

    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  private isValidCnpj(): boolean {
    if (this.isAllDigitsEqual()) return false;

    const cnpjArray = this.value.split('').map(Number);

    const firstVerifier = this.calculateCnpjDigit(cnpjArray.slice(0, 12));
    const secondVerifier = this.calculateCnpjDigit(
      cnpjArray.slice(0, 12).concat(firstVerifier),
    );

    return firstVerifier === cnpjArray[12] && secondVerifier === cnpjArray[13];
  }

  private calculateCnpjDigit(numbers: number[]): number {
    const weights =
      numbers.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const total = numbers.reduce(
      (sum, num, index) => sum + num * weights[index],
      0,
    );

    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  public getFormatted(): string {
    return this.value.length === 11 ? this.formatCpf() : this.formatCnpj();
  }

  private formatCpf(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private formatCnpj(): string {
    return this.value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  }

  public getRaw(): string {
    return this.value;
  }

  toString(): string {
    return this.getFormatted();
  }
}

export class InvalidCpfCnpjError extends Error {
  constructor(message?: string) {
    super(message || 'Invalid CPF or CNPJ');
    this.name = 'InvalidCpfCnpjError';
  }
}
