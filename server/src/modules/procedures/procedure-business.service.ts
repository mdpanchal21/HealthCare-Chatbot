import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalProcedure } from '../../database/entities/hospital-procedure.entity.js';
import { Procedure } from '../../database/entities/procedure.entity.js';
import { Pagination, paged } from '../../common/pagination.js';

@Injectable()
export class ProcedureBusinessService {
  constructor(@InjectRepository(Procedure) private readonly procedures: Repository<Procedure>, @InjectRepository(HospitalProcedure) private readonly links: Repository<HospitalProcedure>) {}
  async hospitals(procedureId: string, query: Pagination & { villageId?: string; schemeId?: string }) {
    const procedure = await this.procedures.findOneBy({ id: procedureId });
    if (!procedure) throw new NotFoundException({ code: 'PROCEDURE_NOT_FOUND', message: 'Procedure not found' });
    const qb = this.links.createQueryBuilder('hp').innerJoinAndSelect('hp.hospital', 'h').innerJoinAndSelect('h.village', 'v').leftJoinAndSelect('h.schemes', 'hs').leftJoinAndSelect('hs.scheme', 's').where('hp.procedureId = :procedureId AND hp.isActive = true', { procedureId });
    if (query.villageId) qb.andWhere('h.villageId = :villageId', { villageId: query.villageId });
    if (query.schemeId) qb.andWhere('hs.schemeId = :schemeId AND hs.isAvailable = true', { schemeId: query.schemeId });
    const [links, total] = await qb.skip((query.page - 1) * query.limit).take(query.limit).getManyAndCount();
    return paged(links.map((link) => ({ hospital: { id: link.hospital.id, name: link.hospital.name, village: { id: link.hospital.village.id, name: link.hospital.village.name } }, procedure: { id: procedure.id, name: procedure.name }, price: { min: link.priceMin, max: link.priceMax }, schemes: link.hospital.schemes.map((item) => ({ name: item.scheme.name, isAvailable: item.isAvailable })) })), query.page, query.limit, total);
  }
}