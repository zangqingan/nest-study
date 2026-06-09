import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './system/module/user/user.module';
import { pinoLoggerModule } from './common/config/pino.config';

@Module({
  imports: [
    // ConfigModule 必须放在 pinoLoggerModule 之前，因为 pino 依赖 ConfigService
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    pinoLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
