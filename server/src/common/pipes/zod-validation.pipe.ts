import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z, ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform<unknown> {
  constructor(private readonly schema: ZodType) {}
  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    const result = this.schema.safeParse(value);
    if (!result.success) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Request validation failed', details: z.treeifyError(result.error) });
    return result.data;
  }
}