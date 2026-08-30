import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalProcedure } from '../../database/entities/hospital-procedure.entity.js';

@Injectable()
export class HospitalProcedureBusinessService {
  constructor(
    @InjectRepository(HospitalProcedure)
    private readonly links: Repository<HospitalProcedure>,
  ) {}
  async findOne(hospitalId: string, procedureId: string) {
    const link = await this.links.findOne({
      where: { hospitalId, procedureId },
      relations: { hospital: true, procedure: true },
    });
    if (!link)
      throw new NotFoundException({
        code: 'HOSPITAL_PROCEDURE_NOT_FOUND',
        message: 'Hospital procedure not found',
      });
    return { success: true, data: link };
  }
  async cost(hospitalId: string, procedureId: string) {
    const link = await this.links.findOne({
      where: { hospitalId, procedureId },
      relations: { hospital: true, procedure: true },
    });
    if (!link)
      throw new NotFoundException({
        code: 'HOSPITAL_PROCEDURE_NOT_FOUND',
        message: 'Hospital procedure not found',
      });
    const range = (min: number | null, max: number | null) =>
      min === null && max === null ? null : { min, max };
    return {
      success: true,
      data: {
        hospital: { id: link.hospital.id, name: link.hospital.name },
        procedure: { id: link.procedure.id, name: link.procedure.name },
        estimatedTotal: range(link.priceMin, link.priceMax),
        breakdown: {
          doctor: range(link.doctorChargeMin, link.doctorChargeMax),
          operation: range(link.operationChargeMin, link.operationChargeMax),
          ot: range(link.otChargeMin, link.otChargeMax),
          room: range(link.roomChargeMin, link.roomChargeMax),
          anesthesia: range(link.anesthesiaChargeMin, link.anesthesiaChargeMax),
          medicine: range(link.medicineChargeMin, link.medicineChargeMax),
          tests: range(link.testChargeMin, link.testChargeMax),
          other: range(link.otherChargeMin, link.otherChargeMax),
        },
        disclaimer:
          'This is an approximate estimate and actual charges may vary.',
      },
    };
  }
}
