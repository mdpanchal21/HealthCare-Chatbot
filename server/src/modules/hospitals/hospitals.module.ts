import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from '../../database/entities/hospital.entity.js';
import { HospitalProcedure } from '../../database/entities/hospital-procedure.entity.js';
import { HospitalScheme } from '../../database/entities/hospital-scheme.entity.js';
import { HospitalsService } from './hospitals.service.js';
import { HospitalsController } from './hospitals.controller.js';
import { HospitalBusinessService } from './hospital-business.service.js';
import {
  HospitalBusinessController,
  EmergencyController,
} from './hospital-business.controller.js';
import { HospitalSearchService } from './hospital-search.service.js';
@Module({
  imports: [
    TypeOrmModule.forFeature([Hospital, HospitalProcedure, HospitalScheme]),
  ],
  controllers: [
    HospitalsController,
    HospitalBusinessController,
    EmergencyController,
  ],
  providers: [HospitalsService, HospitalBusinessService, HospitalSearchService],
  exports: [HospitalsService, HospitalBusinessService, HospitalSearchService],
})
export class HospitalsModule {}
