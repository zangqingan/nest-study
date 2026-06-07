import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JsonReaderModule } from '../../shared/json-reader.module';

@Module({
  imports: [JsonReaderModule.register({ filePath: 'src/common/user.json' })],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
