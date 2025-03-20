import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BULL_CONFIG_FACTORY } from './bull.config';

@Module({
  imports: [
    BullModule.forRootAsync(BULL_CONFIG_FACTORY),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
  ],
})
export class BullMqModule {}
