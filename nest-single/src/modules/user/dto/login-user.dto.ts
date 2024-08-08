import { ApiProperty } from '@nestjs/swagger';
// 增加验证
import { IsNotEmpty } from 'class-validator';
export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名必填' })
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码必填' })
  readonly password: string;
}
