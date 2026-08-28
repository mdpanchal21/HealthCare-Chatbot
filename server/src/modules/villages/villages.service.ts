import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Village } from '../../database/entities/village.entity.js';
import { Hospital } from '../../database/entities/hospital.entity.js';
import { Pagination, paged } from '../../common/pagination.js';

@Injectable()
export class VillagesService {
  constructor(@InjectRepository(Village) private readonly repository: Repository<Village>, @InjectRepository(Hospital) private readonly hospitalRepository: Repository<Hospital>) {}
  async create(input: Partial<Village>) { try { return { success: true, data: await this.repository.save(this.repository.create(input)) }; } catch { throw new ConflictException({ code: 'VILLAGE_ALREADY_EXISTS', message: 'Village already exists' }); } }
  async findAll(query: Pagination & { search?: string; active?: boolean }) { const qb = this.repository.createQueryBuilder('v'); if (query.search) qb.andWhere('LOWER(v.name) LIKE LOWER(:search)', { search: `%${query.search}%` }); if (query.active !== undefined) qb.andWhere('v.isActive = :active', { active: query.active }); const [data, total] = await qb.skip((query.page - 1) * query.limit).take(query.limit).getManyAndCount(); return paged(data, query.page, query.limit, total); }
  async findOne(id: string) { const data = await this.repository.findOne({ where: { id } }); if (!data) throw new NotFoundException({ code: 'VILLAGE_NOT_FOUND', message: 'Village not found' }); return { success: true, data }; }
  async findHospitals(id: string, query: Pagination) { if (!(await this.repository.existsBy({ id }))) throw new NotFoundException({ code: 'VILLAGE_NOT_FOUND', message: 'Village not found' }); const [data, total] = await this.hospitalRepository.findAndCount({ where: { villageId: id }, relations: { village: true }, skip: (query.page - 1) * query.limit, take: query.limit, order: { name: 'ASC' } }); return paged(data, query.page, query.limit, total); }
  async update(id: string, input: Partial<Village>) { const found = await this.repository.findOneBy({ id }); if (!found) throw new NotFoundException({ code: 'VILLAGE_NOT_FOUND', message: 'Village not found' }); try { return { success: true, data: await this.repository.save({ ...found, ...input }) }; } catch { throw new ConflictException({ code: 'VILLAGE_ALREADY_EXISTS', message: 'Village already exists' }); } }
  async remove(id: string) { const result = await this.repository.delete(id); if (!result.affected) throw new NotFoundException({ code: 'VILLAGE_NOT_FOUND', message: 'Village not found' }); return { success: true, data: { id } }; }
}