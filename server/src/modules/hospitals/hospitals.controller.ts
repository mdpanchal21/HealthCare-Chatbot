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
import { HospitalType } from '../../database/entities/hospital.entity.js';
import { paginationSchema } from '../../common/pagination.js';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { HospitalsService } from './hospitals.service.js';
import { HospitalSearchService } from './hospital-search.service.js';

const hospitalSchema = z.object({
  name: z.string().min(2),
  hospitalType: z.enum(HospitalType),
  description: z.string().optional(),
  villageId: z.string().uuid(),
  address: z.string().min(3),
  district: z.string().min(2),
  state: z.string().min(2),
  phone: z.string().optional(),
  emergencyPhone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  emergencyAvailable: z.boolean().optional(),
  ambulanceAvailable: z.boolean().optional(),
  icuAvailable: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
const querySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  villageId: z.string().uuid().optional(),
  procedureId: z.string().uuid().optional(),
  schemeId: z.string().uuid().optional(),
  hospitalType: z.enum(HospitalType).optional(),
  emergencyAvailable: z.coerce.boolean().optional(),
  ambulanceAvailable: z.coerce.boolean().optional(),
  icuAvailable: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
});

@Controller('hospitals')
export class HospitalsController {
  constructor(
    private readonly service: HospitalsService,
    private readonly searchService: HospitalSearchService,
  ) {}
  @Post()
  create(@Body(new ZodValidationPipe(hospitalSchema)) body: unknown) {
    return this.service.create(body as never);
  }
  @Get('search')
  search(@Query(new ZodValidationPipe(querySchema)) query: unknown) {
    return this.searchService.search(query as never);
  }
  @Get()
  findAll(
    @Query(
      new ZodValidationPipe(
        querySchema.omit({ procedureId: true, schemeId: true }),
      ),
    )
    query: unknown,
  ) {
    return this.searchService.list(query as never);
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
        hospitalSchema
          .partial()
          .refine(
            (value) => Object.keys(value).length > 0,
            'At least one field is required',
          ),
      ),
    )
    body: unknown,
  ) {
    return this.service.update(id, body as never);
  }
  @Delete(':id')
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
