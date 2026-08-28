import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class UuidValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const result = z.string().uuid().safeParse(value);
    if (!result.success) throw new BadRequestException({ code: 'INVALID_ID', message: 'ID must be a valid UUID' });
    return result.data;
  }
}