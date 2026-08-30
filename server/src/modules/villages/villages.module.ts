import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Village } from '../../database/entities/village.entity.js';
import { Hospital } from '../../database/entities/hospital.entity.js';
import { VillagesService } from './villages.service.js';
import { VillagesController } from './villages.controller.js';
@Module({
  imports: [TypeOrmModule.forFeature([Village, Hospital])],
  controllers: [VillagesController],
  providers: [VillagesService],
  exports: [VillagesService],
})
export class VillagesModule {}
