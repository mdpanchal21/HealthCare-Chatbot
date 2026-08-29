import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from '../../database/entities/hospital.entity.js';
import { HospitalProcedure } from '../../database/entities/hospital-procedure.entity.js';
import { Pagination, paged } from '../../common/pagination.js';

@Injectable()
export class HospitalBusinessService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitals: Repository<Hospital>,
    @InjectRepository(HospitalProcedure)
    private readonly procedures: Repository<HospitalProcedure>,
  ) {}

  async compare(input: { hospitalIds: string[]; procedureId: string }) {
    const hospitals = await this.hospitals.find({
      where: input.hospitalIds.map((id) => ({ id })),
      relations: {
        village: true,
        procedures: { procedure: true },
        schemes: { scheme: true },
      },
    });
    if (hospitals.length !== input.hospitalIds.length)
      throw new NotFoundException({
        code: 'HOSPITAL_NOT_FOUND',
        message: 'One or more hospitals not found',
      });
    const procedure = await this.procedures.findOne({
      where: { procedureId: input.procedureId },
      relations: { procedure: true },
    });
    if (
      !procedure ||
      hospitals.some(
        (hospital) =>
          !hospital.procedures.some(
            (item) => item.procedureId === input.procedureId,
          ),
      )
    )
      throw new NotFoundException({
        code: 'HOSPITAL_PROCEDURE_NOT_FOUND',
        message: 'Procedure is not available at every selected hospital',
      });
    return {
      success: true,
      data: hospitals.map((hospital) => {
        const item = hospital.procedures.find(
          (candidate) => candidate.procedureId === input.procedureId,
        )!;
        return {
          hospital: {
            id: hospital.id,
            name: hospital.name,
            village: { id: hospital.village.id, name: hospital.village.name },
          },
          procedure: { id: item.procedure.id, name: item.procedure.name },
          price: { min: item.priceMin, max: item.priceMax },
          schemes: hospital.schemes.map((scheme) => ({
            name: scheme.scheme.name,
            isAvailable: scheme.isAvailable,
          })),
        };
      }),
    };
  }

  async emergency(query: Pagination & { villageId?: string }) {
    const [data, total] = await this.hospitals.findAndCount({
      where: {
        emergencyAvailable: true,
        ...(query.villageId ? { villageId: query.villageId } : {}),
      },
      relations: { village: true },
      order: { name: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return paged(
      data.map((hospital) => ({
        id: hospital.id,
        name: hospital.name,
        phone: hospital.phone,
        emergencyPhone: hospital.emergencyPhone,
        ambulanceAvailable: hospital.ambulanceAvailable,
        village: { id: hospital.village.id, name: hospital.village.name },
        address: hospital.address,
      })),
      query.page,
      query.limit,
      total,
    );
  }
}
