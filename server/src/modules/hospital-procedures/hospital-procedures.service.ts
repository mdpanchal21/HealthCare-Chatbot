import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalProcedure } from '../../database/entities/hospital-procedure.entity.js';
import { Hospital } from '../../database/entities/hospital.entity.js';
import { Procedure } from '../../database/entities/procedure.entity.js';

@Injectable()
export class HospitalProceduresService {
  constructor(@InjectRepository(HospitalProcedure) private readonly repository: Repository<HospitalProcedure>, @InjectRepository(Hospital) private readonly hospitalRepository: Repository<Hospital>, @InjectRepository(Procedure) private readonly procedureRepository: Repository<Procedure>) {}
  async create(hospitalId: string, input: Partial<HospitalProcedure>) { if (!(await this.hospitalRepository.existsBy({ id: hospitalId }))) throw new NotFoundException({ code: 'HOSPITAL_NOT_FOUND', message: 'Hospital not found' }); if (!(await this.procedureRepository.existsBy({ id: input.procedureId! }))) throw new NotFoundException({ code: 'PROCEDURE_NOT_FOUND', message: 'Procedure not found' }); if (await this.repository.existsBy({ hospitalId, procedureId: input.procedureId! })) throw new ConflictException({ code: 'HOSPITAL_PROCEDURE_ALREADY_EXISTS', message: 'Procedure is already linked to this hospital' }); return { success: true, data: await this.repository.save(this.repository.create({ ...input, hospitalId })) }; }
  async findAll(hospitalId: string) { if (!(await this.hospitalRepository.existsBy({ id: hospitalId }))) throw new NotFoundException({ code: 'HOSPITAL_NOT_FOUND', message: 'Hospital not found' }); return { success: true, data: await this.repository.find({ where: { hospitalId }, relations: { procedure: true } }) }; }
  async update(hospitalId: string, procedureId: string, input: Partial<HospitalProcedure>) { const found = await this.repository.findOne({ where: { hospitalId, procedureId } }); if (!found) throw new NotFoundException({ code: 'HOSPITAL_PROCEDURE_NOT_FOUND', message: 'Hospital procedure not found' }); return { success: true, data: await this.repository.save({ ...found, ...input }) }; }
  async remove(hospitalId: string, procedureId: string) { const result = await this.repository.delete({ hospitalId, procedureId }); if (!result.affected) throw new NotFoundException({ code: 'HOSPITAL_PROCEDURE_NOT_FOUND', message: 'Hospital procedure not found' }); return { success: true, data: { hospitalId, procedureId } }; }
}