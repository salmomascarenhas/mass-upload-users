import { CpfCnpj, InvalidCpfCnpjError } from '../cpf-cnpj.vo';

describe('CpfCnpj', () => {
  it('should accept a valid CPF with mask', () => {
    const cpfCnpj = new CpfCnpj('123.456.789-09');
    expect(cpfCnpj.getRaw()).toBe('12345678909');
    expect(cpfCnpj.getFormatted()).toBe('123.456.789-09');
  });

  it('should accept a valid CPF without mask', () => {
    const cpfCnpj = new CpfCnpj('12345678909');
    expect(cpfCnpj.getRaw()).toBe('12345678909');
    expect(cpfCnpj.getFormatted()).toBe('123.456.789-09');
  });

  it('should accept a valid CNPJ with mask', () => {
    const cpfCnpj = new CpfCnpj('12.345.678/0001-95');
    expect(cpfCnpj.getRaw()).toBe('12345678000195');
    expect(cpfCnpj.getFormatted()).toBe('12.345.678/0001-95');
  });

  it('should accept a valid CNPJ without mask', () => {
    const cpfCnpj = new CpfCnpj('12345678000195');
    expect(cpfCnpj.getRaw()).toBe('12345678000195');
    expect(cpfCnpj.getFormatted()).toBe('12.345.678/0001-95');
  });

  it('should throw an error for an invalid CPF', () => {
    expect(() => new CpfCnpj('123.456.789-00')).toThrow(InvalidCpfCnpjError);
  });

  it('should throw an error for an invalid CNPJ', () => {
    expect(() => new CpfCnpj('12.345.678/0001-00')).toThrow(
      InvalidCpfCnpjError,
    );
  });

  it('should throw an error for an invalid format', () => {
    expect(() => new CpfCnpj('abc.def.ghi-jk')).toThrow(InvalidCpfCnpjError);
  });

  it('should throw an error for all equal digits in CPF', () => {
    expect(() => new CpfCnpj('111.111.111-11')).toThrow(InvalidCpfCnpjError);
  });

  it('should throw an error for all equal digits in CNPJ', () => {
    expect(() => new CpfCnpj('11.111.111/1111-11')).toThrow(
      InvalidCpfCnpjError,
    );
  });

  it('should correctly format a CPF', () => {
    const cpfCnpj = new CpfCnpj('12345678909');
    expect(cpfCnpj.getFormatted()).toBe('123.456.789-09');
  });

  it('should correctly format a CNPJ', () => {
    const cpfCnpj = new CpfCnpj('12345678000195');
    expect(cpfCnpj.getFormatted()).toBe('12.345.678/0001-95');
  });

  it('should accept valid CPFs', () => {
    const validCpfs = [
      '529.982.247-25',
      '123.456.789-09',
      '111.444.777-35',
      '123.123.123-87',
    ];
    validCpfs.forEach((cpf) => {
      expect(() => new CpfCnpj(cpf)).not.toThrow();
    });
  });

  it('should accept valid CNPJs', () => {
    const validCnpjs = ['12.345.678/0001-95', '54.321.987/0001-66'];
    validCnpjs.forEach((cnpj) => {
      expect(() => new CpfCnpj(cnpj)).not.toThrow();
    });
  });

  it('should reject invalid CPFs with incorrect check digits', () => {
    const invalidCpfs = ['529.982.247-24', '123.456.789-08', '111.444.777-34'];
    invalidCpfs.forEach((cpf) => {
      expect(() => new CpfCnpj(cpf)).toThrow(InvalidCpfCnpjError);
    });
  });

  it('should reject invalid CNPJs with incorrect check digits', () => {
    const invalidCnpjs = ['12.345.678/0001-00', '54.321.987/0001-11'];
    invalidCnpjs.forEach((cnpj) => {
      expect(() => new CpfCnpj(cnpj)).toThrow(InvalidCpfCnpjError);
    });
  });
});
