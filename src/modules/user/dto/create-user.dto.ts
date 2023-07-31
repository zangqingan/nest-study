import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// 增加验证
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名必填' })
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码必填' })
  readonly password: string;

  // 可选参数
  @ApiPropertyOptional({ description: '昵称' })
  readonly nickname: string;

  // 可选参数
  @ApiPropertyOptional({ description: '头像' })
  readonly avatar: string;

  // 可选参数
  @ApiPropertyOptional({ description: '邮箱' })
  readonly email: string;

  @ApiProperty({ description: '用户角色' })
  @IsString()
  readonly role: string;
}
