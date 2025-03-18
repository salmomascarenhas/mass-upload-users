import { Whitelabel } from '../../../../../whitelabel/domain/whitelabel';
import { WhitelabelInMemoryRepository } from '../../../../../whitelabel/infra/db/in-memory/whitelabel-in-memory.repository';
import { UserInMemoryRepository } from '../../../../infra/db/in-memory/user-in-memory.repository';
import { CreateUserUseCase } from '../create-user.use-case';

describe('CreateUserUseCase Unit Tests', () => {
  let useCase: CreateUserUseCase;
  let userRepository: UserInMemoryRepository;
  let whitelabelRepository: WhitelabelInMemoryRepository;
  let whitelabelId: string;

  beforeEach(async () => {
    userRepository = new UserInMemoryRepository();
    whitelabelRepository = new WhitelabelInMemoryRepository();
    useCase = new CreateUserUseCase(userRepository, whitelabelRepository);

    const whitelabel = Whitelabel.create({
      name: 'MyClub',
      url: 'https://myclub.com',
    });
    await whitelabelRepository.insert(whitelabel);
    whitelabelId = whitelabel.toString();
  });

  it('should create a user', async () => {
    const spyInsert = jest.spyOn(userRepository, 'insert');

    const input = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf_cnpj: '091.012.426-44',
      whitelabel_id: whitelabelId,
    };

    const output = await useCase.execute(input);

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      user_id: userRepository.items[0].user_id.id,
      name: userRepository.items[0].name,
      email: userRepository.items[0].email,
      cpf_cnpj: userRepository.items[0].cpf_cnpj.getFormatted(),
      whitelabel_id: userRepository.items[0].whitelabel_id,
      created_at: userRepository.items[0].created_at,
      updated_at: userRepository.items[0].updated_at,
    });
  });

  it('should not allow duplicate email within the same whitelabel', async () => {
    const input = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf_cnpj: '091.012.426-44',
      whitelabel_id: whitelabelId,
    };

    await useCase.execute(input);

    await expect(useCase.execute(input)).rejects.toThrowError(
      `User with email john.doe@example.com already exists`,
    );
  });

  it('should not allow duplicate CPF/CNPJ within the same whitelabel', async () => {
    await useCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf_cnpj: '091.012.426-44',
      whitelabel_id: whitelabelId,
    });

    await expect(
      useCase.execute({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        cpf_cnpj: '091.012.426-44', // mesmo CPF
        whitelabel_id: whitelabelId,
      }),
    ).rejects.toThrowError(`User with CPF/CNPJ 091.012.426-44 already exists`);
  });

  it('should allow same email or CPF in different whitelabels', async () => {
    // Criando um segundo Whitelabel
    const whitelabel2 = Whitelabel.create({
      name: 'AnotherClub',
      url: 'https://anotherclub.com',
    });
    await whitelabelRepository.insert(whitelabel2);
    const anotherWhitelabelId = whitelabel2.whitelabel_id.id;

    const input1 = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf_cnpj: '091.012.426-44',
      whitelabel_id: whitelabelId,
    };

    const input2 = {
      name: 'Jane Doe',
      email: 'john.doe@example.com', // mesmo e-mail
      cpf_cnpj: '646.363.891-90', // CPF diferente
      whitelabel_id: anotherWhitelabelId,
    };

    await useCase.execute(input1);
    await expect(useCase.execute(input2)).resolves.not.toThrow();
  });

  it('should not create a user for a non-existing whitelabel', async () => {
    await expect(
      useCase.execute({
        name: 'John Doe',
        email: 'john.doe@example.com',
        cpf_cnpj: '091.012.426-44',
        whitelabel_id: 'non-existing-whitelabel-id',
      }),
    ).rejects.toThrowError(
      `Whitelabel com ID non-existing-whitelabel-id não encontrado.`,
    );
  });
});
