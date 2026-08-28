import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalScheme } from '../../database/entities/hospital-scheme.entity.js';
import { Hospital } from '../../database/entities/hospital.entity.js';
import { Scheme } from '../../database/entities/scheme.entity.js';

@Injectable()
export class HospitalSchemesService {
  constructor(@InjectRepository(HospitalScheme) private readonly repository: Repository<HospitalScheme>, @InjectRepository(Hospital) private readonly hospitalRepository: Repository<Hospital>, @InjectRepository(Scheme) private readonly schemeRepository: Repository<Scheme>) {}
  async create(hospitalId: string, input: Partial<HospitalScheme>) { if (!(await this.hospitalRepository.existsBy({ id: hospitalId }))) throw new NotFoundException({ code: 'HOSPITAL_NOT_FOUND', message: 'Hospital not found' }); if (!(await this.schemeRepository.existsBy({ id: input.schemeId! }))) throw new NotFoundException({ code: 'SCHEME_NOT_FOUND', message: 'Scheme not found' }); if (await this.repository.existsBy({ hospitalId, schemeId: input.schemeId! })) throw new ConflictException({ code: 'HOSPITAL_SCHEME_ALREADY_EXISTS', message: 'Scheme is already linked to this hospital' }); return { success: true, data: await this.repository.save(this.repository.create({ ...input, hospitalId })) }; }
  async findAll(hospitalId: string) { if (!(await this.hospitalRepository.existsBy({ id: hospitalId }))) throw new NotFoundException({ code: 'HOSPITAL_NOT_FOUND', message: 'Hospital not found' }); return { success: true, data: await this.repository.find({ where: { hospitalId }, relations: { scheme: true } }) }; }
  async findOne(hospitalId: string, schemeId: string) { const data = await this.repository.findOne({ where: { hospitalId, schemeId }, relations: { scheme: true } }); if (!data) throw new NotFoundException({ code: 'HOSPITAL_SCHEME_NOT_FOUND', message: 'Hospital scheme not found' }); return { success: true, data }; }
  async update(hospitalId: string, schemeId: string, input: Partial<HospitalScheme>) { const found = await this.repository.findOne({ where: { hospitalId, schemeId } }); if (!found) throw new NotFoundException({ code: 'HOSPITAL_SCHEME_NOT_FOUND', message: 'Hospital scheme not found' }); return { success: true, data: await this.repository.save({ ...found, ...input }) }; }
  async remove(hospitalId: string, schemeId: string) { const result = await this.repository.delete({ hospitalId, schemeId }); if (!result.affected) throw new NotFoundException({ code: 'HOSPITAL_SCHEME_NOT_FOUND', message: 'Hospital scheme not found' }); return { success: true, data: { hospitalId, schemeId } }; }
}