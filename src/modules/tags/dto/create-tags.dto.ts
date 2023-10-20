import { ApiProperty } from '@nestjs/swagger';
// 增加验证
import { IsNotEmpty } from 'class-validator';
export class CreateTagsDto {
  @ApiProperty({ description: '标签名' })
  @IsNotEmpty({ message: '标签名必填' })
  readonly name: string;
}
