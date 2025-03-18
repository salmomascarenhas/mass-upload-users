import { CreateUserUseCase } from '../../core/user/application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from '../../core/user/application/use-cases/delete-user/delete-user.use-case';
import { GetUserUseCase } from '../../core/user/application/use-cases/get-user/get-user.use-case';
import { ListUsersUseCase } from '../../core/user/application/use-cases/list-users/list-users.use-case';
import { UpdateUserUseCase } from '../../core/user/application/use-cases/update-user/update-user.use-case';
import { IUserRepository } from '../../core/user/domain/user.repository';
import { UserInMemoryRepository } from '../../core/user/infra/db/in-memory/user-in-memory.repository';
import { UserPrismaRepository } from '../../core/user/infra/db/prisma/user-prisma.repository';
import { IWhitelabelRepository } from '../../core/whitelabel/domain/whitelabel.repository';
import { PrismaService } from '../database/prisma/prisma.service';
import { WHITELABEL_PROVIDERS } from '../whitelabel/whitelabels.providers';

export const REPOSITORIES = {
  USER_REPOSITORY: {
    provide: 'UserRepository',
    useExisting: UserPrismaRepository,
  },
  USER_IN_MEMORY_REPOSITORY: {
    provide: UserInMemoryRepository,
    useClass: UserInMemoryRepository,
  },
  USER_PRISMA_REPOSITORY: {
    provide: UserPrismaRepository,
    useFactory: (prisma: PrismaService) => {
      return new UserPrismaRepository(prisma);
    },
    inject: [PrismaService],
  },
};

export const USE_CASES = {
  CREATE_USER_USE_CASE: {
    provide: CreateUserUseCase,
    useFactory: (
      userRepo: IUserRepository,
      whitelabelRepo: IWhitelabelRepository,
    ) => {
      return new CreateUserUseCase(userRepo, whitelabelRepo);
    },
    inject: [
      REPOSITORIES.USER_REPOSITORY.provide,
      WHITELABEL_PROVIDERS.REPOSITORIES.WHITELABEL_REPOSITORY.provide,
    ],
  },
  UPDATE_USER_USE_CASE: {
    provide: UpdateUserUseCase,
    useFactory: (userRepo: IUserRepository) => {
      return new UpdateUserUseCase(userRepo);
    },
    inject: [REPOSITORIES.USER_REPOSITORY.provide],
  },
  LIST_CATEGORIES_USE_CASE: {
    provide: ListUsersUseCase,
    useFactory: (userRepo: IUserRepository) => {
      return new ListUsersUseCase(userRepo);
    },
    inject: [REPOSITORIES.USER_REPOSITORY.provide],
  },
  GET_USER_USE_CASE: {
    provide: GetUserUseCase,
    useFactory: (userRepo: IUserRepository) => {
      return new GetUserUseCase(userRepo);
    },
    inject: [REPOSITORIES.USER_REPOSITORY.provide],
  },
  DELETE_USER_USE_CASE: {
    provide: DeleteUserUseCase,
    useFactory: (userRepo: IUserRepository) => {
      return new DeleteUserUseCase(userRepo);
    },
    inject: [REPOSITORIES.USER_REPOSITORY.provide],
  },
};

export const USER_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
