import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullMqModule } from './nestjs-modules/shared/bull-mq/bull-mq.module';
import { ConfigModule } from './nestjs-modules/shared/config/config.module';
import { DatabaseModule } from './nestjs-modules/shared/database/database.module';
import { UploadUsersModule } from './nestjs-modules/upload-users/upload-users.module';
import { UsersModule } from './nestjs-modules/users/users.module';
import { WhitelabelsModule } from './nestjs-modules/whitelabel/whitelabels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    WhitelabelsModule,
    UsersModule,
    UploadUsersModule,
    BullMqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
