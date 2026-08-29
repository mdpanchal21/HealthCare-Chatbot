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
import { VillagesService } from './villages.service.js';
const villageSchema = z.object({
  name: z.string().trim().min(2),
  district: z.string().trim().min(2),
  state: z.string().trim().min(2),
  isActive: z.boolean().optional(),
});
const villageQuery = paginationSchema.extend({
  search: z.string().optional(),
  active: z.coerce.boolean().optional(),
});
@Controller('villages')
export class VillagesController {
  constructor(private readonly service: VillagesService) {}
  @Post()
  create(@Body(new ZodValidationPipe(villageSchema)) body: unknown) {
    return this.service.create(body as Record<string, unknown>);
  }
  @Get()
  findAll(@Query(new ZodValidationPipe(villageQuery)) query: unknown) {
    return this.service.findAll(query as never);
  }
  @Get(':id/hospitals')
  findHospitals(
    @Param('id', UuidValidationPipe) id: string,
    @Query(new ZodValidationPipe(paginationSchema)) query: unknown,
  ) {
    return this.service.findHospitals(id, query as never);
  }
  @Get(':id')
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.service.findOne(id);
  }
  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(
      new ZodValidationPipe(
        villageSchema
          .partial()
          .refine(
            (value) => Object.keys(value).length > 0,
            'At least one field is required',
          ),
      ),
    )
    body: unknown,
  ) {
    return this.service.update(id, body as Record<string, unknown>);
  }
  @Delete(':id')
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
