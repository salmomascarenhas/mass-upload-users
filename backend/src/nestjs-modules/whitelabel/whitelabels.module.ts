import { Module } from '@nestjs/common';
import { WhitelabelsController } from './whilabels.controller';
import { WHITELABEL_PROVIDERS } from './whitelabels.providers';

@Module({
  imports: [],
  controllers: [WhitelabelsController],
  providers: [
    ...Object.values(WHITELABEL_PROVIDERS.REPOSITORIES),
    ...Object.values(WHITELABEL_PROVIDERS.USE_CASES),
  ],
  exports: [
    WHITELABEL_PROVIDERS.REPOSITORIES.WHITELABEL_REPOSITORY.provide,
    ...Object.values(WHITELABEL_PROVIDERS.USE_CASES),
  ],
})
export class WhitelabelsModule {}
