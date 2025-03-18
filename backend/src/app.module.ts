import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './nestjs-modules/config/config.module';
import { DatabaseModule } from './nestjs-modules/database/database.module';
import { UsersModule } from './nestjs-modules/users/users.module';
import { WhitelabelsModule } from './nestjs-modules/whitelabel/whitelabels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    WhitelabelsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
