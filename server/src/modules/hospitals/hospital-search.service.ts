import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Hospital,
  HospitalType,
} from '../../database/entities/hospital.entity.js';
import { Pagination, paged } from '../../common/pagination.js';

export type HospitalQuery = Pagination & {
  search?: string;
  villageId?: string;
  procedureId?: string;
  schemeId?: string;
  hospitalType?: HospitalType;
  emergencyAvailable?: boolean;
  ambulanceAvailable?: boolean;
  icuAvailable?: boolean;
  active?: boolean;
  isActive?: boolean;
};

@Injectable()
export class HospitalSearchService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitals: Repository<Hospital>,
  ) {}

  async list(query: HospitalQuery) {
    const qb = this.hospitals
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.village', 'v');
    this.applyFilters(qb, query, false);
    const [data, total] = await qb
      .orderBy('h.name', 'ASC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();
    return paged(data, query.page, query.limit, total);
  }

  async search(query: HospitalQuery) {
    const qb = this.hospitals
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.village', 'v')
      .leftJoinAndSelect('h.procedures', 'hp')
      .leftJoinAndSelect('hp.procedure', 'p')
      .leftJoinAndSelect('h.schemes', 'hs')
      .leftJoinAndSelect('hs.scheme', 's');
    this.applyFilters(qb, query, true);
    const [rows, total] = await qb
      .orderBy('h.name', 'ASC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();
    const data = rows.map((hospital) => {
      const procedure = query.procedureId
        ? hospital.procedures.find(
            (item) => item.procedureId === query.procedureId,
          )
        : undefined;
      return {
        id: hospital.id,
        name: hospital.name,
        village: { id: hospital.village.id, name: hospital.village.name },
        phone: hospital.phone,
        emergencyPhone: hospital.emergencyPhone,
        emergencyAvailable: hospital.emergencyAvailable,
        ambulanceAvailable: hospital.ambulanceAvailable,
        icuAvailable: hospital.icuAvailable,
        procedure: procedure
          ? {
              id: procedure.procedure.id,
              name: procedure.procedure.name,
              priceMin: procedure.priceMin,
              priceMax: procedure.priceMax,
            }
          : null,
        schemes: hospital.schemes.map((item) => ({
          name: item.scheme.name,
          isAvailable: item.isAvailable,
        })),
      };
    });
    return paged(data, query.page, query.limit, total);
  }

  private applyFilters(
    qb: ReturnType<Repository<Hospital>['createQueryBuilder']>,
    query: HospitalQuery,
    includeRelations: boolean,
  ) {
    if (query.search)
      qb.andWhere('LOWER(h.name) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    if (query.villageId)
      qb.andWhere('h.villageId = :villageId', { villageId: query.villageId });
    if (query.procedureId && includeRelations)
      qb.andWhere('hp.procedureId = :procedureId AND hp.isActive = true', {
        procedureId: query.procedureId,
      });
    if (query.schemeId && includeRelations)
      qb.andWhere('hs.schemeId = :schemeId AND hs.isAvailable = true', {
        schemeId: query.schemeId,
      });
    if (query.hospitalType)
      qb.andWhere('h.hospitalType = :hospitalType', {
        hospitalType: query.hospitalType,
      });
    if (query.emergencyAvailable !== undefined)
      qb.andWhere('h.emergencyAvailable = :emergencyAvailable', {
        emergencyAvailable: query.emergencyAvailable,
      });
    if (query.ambulanceAvailable !== undefined)
      qb.andWhere('h.ambulanceAvailable = :ambulanceAvailable', {
        ambulanceAvailable: query.ambulanceAvailable,
      });
    if (query.icuAvailable !== undefined)
      qb.andWhere('h.icuAvailable = :icuAvailable', {
        icuAvailable: query.icuAvailable,
      });
    if (query.active !== undefined || query.isActive !== undefined)
      qb.andWhere('h.isActive = :isActive', {
        isActive: query.active ?? query.isActive,
      });
  }
}
