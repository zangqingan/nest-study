import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CustomValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('CustomValidatePipe', value, metadata);
    return value;
  }
}
