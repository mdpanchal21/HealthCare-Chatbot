import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe.js';
import { paginationSchema } from '../../common/pagination.js';
import { SchemesService } from './schemes.service.js';
const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  state: z.string().optional(),
  isActive: z.boolean().optional(),
});
const querySchema = paginationSchema.extend({
  search: z.string().optional(),
  state: z.string().optional(),
  active: z.coerce.boolean().optional(),
});
@Controller('schemes')
export class SchemesController {
  constructor(private readonly service: SchemesService) {}
  @Post() create(@Body(new ZodValidationPipe(schema)) b: unknown) {
    return this.service.create(b as never);
  }
  @Get() findAll(@Query(new ZodValidationPipe(querySchema)) q: unknown) {
    return this.service.findAll(q as never);
  }
  @Get(':id') findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.service.findOne(id);
  }
  @Patch(':id') update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(
      new ZodValidationPipe(
        schema
          .partial()
          .refine(
            (value) => Object.keys(value).length > 0,
            'At least one field is required',
          ),
      ),
    )
    b: unknown,
  ) {
    return this.service.update(id, b as never);
  }
  @Delete(':id') remove(@Param('id', UuidValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
