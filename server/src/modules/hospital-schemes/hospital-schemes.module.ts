import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalScheme } from '../../database/entities/hospital-scheme.entity.js';
import { Hospital } from '../../database/entities/hospital.entity.js';
import { Scheme } from '../../database/entities/scheme.entity.js';
import { HospitalSchemesService } from './hospital-schemes.service.js';
import { HospitalSchemesController } from './hospital-schemes.controller.js';
@Module({
  imports: [TypeOrmModule.forFeature([HospitalScheme, Hospital, Scheme])],
  controllers: [HospitalSchemesController],
  providers: [HospitalSchemesService],
})
export class HospitalSchemesModule {}
