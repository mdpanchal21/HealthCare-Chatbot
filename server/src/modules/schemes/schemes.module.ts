import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheme } from '../../database/entities/scheme.entity.js';
import { HospitalScheme } from '../../database/entities/hospital-scheme.entity.js';
import { SchemesService } from './schemes.service.js';
import { SchemesController } from './schemes.controller.js';
import { SchemeBusinessService } from './scheme-business.service.js';
import { SchemeBusinessController } from './scheme-business.controller.js';
@Module({
  imports: [TypeOrmModule.forFeature([Scheme, HospitalScheme])],
  controllers: [SchemesController, SchemeBusinessController],
  providers: [SchemesService, SchemeBusinessService],
  exports: [SchemesService],
})
export class SchemesModule {}
