import { CreateWhitelabelUseCase } from '../../core/whitelabel/application/use-cases/create-whitelabel/create-whitelabel.use-case';
import { DeleteWhitelabelUseCase } from '../../core/whitelabel/application/use-cases/delete-whitelabel/delete-whitelabel.use-case';
import { GetWhitelabelUseCase } from '../../core/whitelabel/application/use-cases/get-whitelabel/get-whitelabel.use-case';
import { ListWhitelabelsUseCase } from '../../core/whitelabel/application/use-cases/list-whitelabels/list-whitelabels.use-case';
import { UpdateWhitelabelUseCase } from '../../core/whitelabel/application/use-cases/update-whitelabel/update-whitelabel.use-case';
import { WhitelabelInMemoryRepository } from '../../core/whitelabel/infra/db/in-memory/whitelabel-in-memory.repository';
import { WhitelabelPrismaRepository } from '../../core/whitelabel/infra/db/prisma/whitelabel-prisma.repository';
import { PrismaService } from '../database/prisma/prisma.service';

export const REPOSITORIES = {
  WHITELABEL_REPOSITORY: {
    provide: 'WhitelabelRepository',
    useExisting: WhitelabelPrismaRepository,
  },
  WHITELABEL_IN_MEMORY_REPOSITORY: {
    provide: WhitelabelInMemoryRepository,
    useClass: WhitelabelInMemoryRepository,
  },
  WHITELABEL_PRISMA_REPOSITORY: {
    provide: WhitelabelPrismaRepository,
    useFactory: (prisma: PrismaService) => {
      return new WhitelabelPrismaRepository(prisma);
    },
    inject: [PrismaService],
  },
};

export const USE_CASES = {
  CREATE_WHITELABEL_USE_CASE: {
    provide: CreateWhitelabelUseCase,
    useFactory: (whitelabelRepo: WhitelabelPrismaRepository) => {
      return new CreateWhitelabelUseCase(whitelabelRepo);
    },
    inject: [REPOSITORIES.WHITELABEL_REPOSITORY.provide],
  },
  UPDATE_WHITELABEL_USE_CASE: {
    provide: UpdateWhitelabelUseCase,
    useFactory: (userRepo: WhitelabelPrismaRepository) => {
      return new UpdateWhitelabelUseCase(userRepo);
    },
    inject: [REPOSITORIES.WHITELABEL_REPOSITORY.provide],
  },
  LIST_CATEGORIES_USE_CASE: {
    provide: ListWhitelabelsUseCase,
    useFactory: (userRepo: WhitelabelPrismaRepository) => {
      return new ListWhitelabelsUseCase(userRepo);
    },
    inject: [REPOSITORIES.WHITELABEL_REPOSITORY.provide],
  },
  GET_WHITELABEL_USE_CASE: {
    provide: GetWhitelabelUseCase,
    useFactory: (userRepo: WhitelabelPrismaRepository) => {
      return new GetWhitelabelUseCase(userRepo);
    },
    inject: [REPOSITORIES.WHITELABEL_REPOSITORY.provide],
  },
  DELETE_WHITELABEL_USE_CASE: {
    provide: DeleteWhitelabelUseCase,
    useFactory: (userRepo: WhitelabelPrismaRepository) => {
      return new DeleteWhitelabelUseCase(userRepo);
    },
    inject: [REPOSITORIES.WHITELABEL_REPOSITORY.provide],
  },
};

export const WHITELABEL_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
