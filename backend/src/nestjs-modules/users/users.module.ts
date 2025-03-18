import { Module } from '@nestjs/common';
import { WhitelabelsModule } from '../whitelabel/whitelabels.module';
import { UsersController } from './users.controller';
import { USER_PROVIDERS } from './users.providers';

@Module({
  imports: [WhitelabelsModule],
  controllers: [UsersController],
  providers: [
    ...Object.values(USER_PROVIDERS.REPOSITORIES),
    ...Object.values(USER_PROVIDERS.USE_CASES),
  ],
  exports: [
    USER_PROVIDERS.REPOSITORIES.USER_REPOSITORY.provide,
    ...Object.values(USER_PROVIDERS.USE_CASES),
  ],
})
export class UsersModule {}
