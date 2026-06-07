import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: '书名不能为空' })
  title!: string;

  @IsNotEmpty({ message: '作者不能为空' })
  author!: string;

  @IsNotEmpty({ message: '描述不能为空' })
  description!: string;

  @IsNotEmpty({ message: '价格不能为空' })
  price!: number;

  @IsNotEmpty({ message: '分类不能为空' })
  category!: string;

  @IsNotEmpty({ message: '封面不能为空' })
  link!: string;
}
