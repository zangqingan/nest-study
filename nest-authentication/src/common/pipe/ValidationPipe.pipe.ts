import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // 如果没有传入验证规则, 则不验证, 直接返回数据
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // plainToInstance 方法将普通的 JavaScript 参数对象转换为可验证的 dto class 的实例对象。
    const object = plainToInstance(metatype, value);
    // 调用 class-validator 包的 validate api 对它做验证。如果验证不通过, 就抛一个异常。
    // errors 是一个数组, 里面存放着验证失败的错误信息。
    const errors = await validate(object);
    if (errors.length > 0) {
      // const msg = Object.values(errors[0].constraints)[0]; // 只需要取第一个错误信息并返回即可
      throw new BadRequestException(`Validation failed:${errors}`);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
