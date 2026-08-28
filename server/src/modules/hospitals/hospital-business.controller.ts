import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { paginationSchema } from '../../common/pagination.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { HospitalBusinessService } from './hospital-business.service.js';

const compareSchema = z.object({ hospitalIds: z.array(z.string().uuid()).min(1).max(10).refine((ids) => new Set(ids).size === ids.length, 'Hospital IDs must be unique'), procedureId: z.string().uuid() });
const emergencySchema = paginationSchema.extend({ villageId: z.string().uuid().optional() });

@Controller()
@ApiTags('Hospital business')
export class HospitalBusinessController {
  constructor(private readonly service: HospitalBusinessService) {}
  @Post('hospitals/compare') @ApiOperation({ summary: 'Compare hospitals for a procedure' }) compare(@Body(new ZodValidationPipe(compareSchema)) body: unknown) { return this.service.compare(body as { hospitalIds: string[]; procedureId: string }); }
}

@Controller('emergency')
@ApiTags('Emergency')
export class EmergencyController {
  constructor(private readonly service: HospitalBusinessService) {}
  @Get('hospitals') @ApiOperation({ summary: 'List hospitals with emergency services' }) emergency(@Query(new ZodValidationPipe(emergencySchema)) query: unknown) { return this.service.emergency(query as never); }
}