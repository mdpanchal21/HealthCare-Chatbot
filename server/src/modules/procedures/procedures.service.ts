import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Procedure } from '../../database/entities/procedure.entity.js';
import { Pagination, paged } from '../../common/pagination.js';
@Injectable()
export class ProceduresService {
  constructor(
    @InjectRepository(Procedure)
    private readonly repository: Repository<Procedure>,
  ) {}
  async create(input: Partial<Procedure>) {
    try {
      return {
        success: true,
        data: await this.repository.save(this.repository.create(input)),
      };
    } catch {
      throw new ConflictException({
        code: 'PROCEDURE_ALREADY_EXISTS',
        message: 'Procedure already exists',
      });
    }
  }
  async findAll(
    query: Pagination & {
      search?: string;
      category?: string;
      active?: boolean;
    },
  ) {
    const qb = this.repository.createQueryBuilder('p');
    if (query.search)
      qb.andWhere('LOWER(p.name) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    if (query.category)
      qb.andWhere('p.category = :category', { category: query.category });
    if (query.active !== undefined)
      qb.andWhere('p.isActive = :active', { active: query.active });
    const [data, total] = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();
    return paged(data, query.page, query.limit, total);
  }
  async findOne(id: string) {
    const data = await this.repository.findOneBy({ id });
    if (!data)
      throw new NotFoundException({
        code: 'PROCEDURE_NOT_FOUND',
        message: 'Procedure not found',
      });
    return { success: true, data };
  }
  async update(id: string, input: Partial<Procedure>) {
    const found = await this.repository.findOneBy({ id });
    if (!found)
      throw new NotFoundException({
        code: 'PROCEDURE_NOT_FOUND',
        message: 'Procedure not found',
      });
    try {
      return {
        success: true,
        data: await this.repository.save({ ...found, ...input }),
      };
    } catch {
      throw new ConflictException({
        code: 'PROCEDURE_ALREADY_EXISTS',
        message: 'Procedure already exists',
      });
    }
  }
  async remove(id: string) {
    const result = await this.repository.delete(id);
    if (!result.affected)
      throw new NotFoundException({
        code: 'PROCEDURE_NOT_FOUND',
        message: 'Procedure not found',
      });
    return { success: true, data: { id } };
  }
}
