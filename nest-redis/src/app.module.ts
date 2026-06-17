// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST', '127.0.0.1'),
        port: configService.get<number>('REDIS_PORT', 6379),
        password: configService.get<string>('REDIS_PASSWORD', ''),
        db: configService.get<number>('REDIS_DB', 0),
        keyPrefix: configService.get<string>('REDIS_KEY_PREFIX', 'myapp:'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
