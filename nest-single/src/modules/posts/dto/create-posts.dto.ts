import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// 增加验证
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @ApiProperty({ description: '作者' })
  @IsNotEmpty({ message: '缺少作者信息' })
  readonly author: string;
  // 可选参数
  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面' })
  readonly thumb_url: string;

  @ApiProperty({ description: '文章类型' })
  @IsNumber()
  readonly type: number;
}
