import { Controller, Get, Param } from '@nestjs/common'; import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe.js';
import { HospitalProcedureBusinessService } from './hospital-procedure-business.service.js';

@Controller('hospitals/:hospitalId/procedures')
@ApiTags('Hospital procedure business')
export class HospitalProcedureBusinessController {
  constructor(private readonly service: HospitalProcedureBusinessService) {}
  @Get(':procedureId/cost') @ApiOperation({ summary: 'Get approximate procedure cost' }) cost(@Param('hospitalId', UuidValidationPipe) hospitalId: string, @Param('procedureId', UuidValidationPipe) procedureId: string) { return this.service.cost(hospitalId, procedureId); }
  @Get(':procedureId') @ApiOperation({ summary: 'Get a hospital procedure link' }) findOne(@Param('hospitalId', UuidValidationPipe) hospitalId: string, @Param('procedureId', UuidValidationPipe) procedureId: string) { return this.service.findOne(hospitalId, procedureId); }
}