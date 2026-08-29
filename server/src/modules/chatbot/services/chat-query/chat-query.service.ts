import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, ILike } from 'typeorm';

import { Hospital } from '../../../../database/entities/hospital.entity.js';
import { HospitalProcedure } from '../../../../database/entities/hospital-procedure.entity.js';
import { HospitalScheme } from '../../../../database/entities/hospital-scheme.entity.js';
import { ChatIntentData } from '../../schemas/chat-intent.schema.js';

@Injectable()
export class ChatQueryService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,

    @InjectRepository(HospitalProcedure)
    private readonly hospitalProcedureRepository: Repository<HospitalProcedure>,

    @InjectRepository(HospitalScheme)
    private readonly hospitalSchemeRepository: Repository<HospitalScheme>,
  ) {}

  async findHospitals(data: ChatIntentData) {
    const query = this.hospitalRepository
      .createQueryBuilder('hospital')
      .leftJoinAndSelect('hospital.village', 'village')
      .leftJoinAndSelect('hospital.procedures', 'hospitalProcedure')
      .leftJoinAndSelect('hospitalProcedure.procedure', 'procedure')
      .where('hospital.isActive = :isActive', {
        isActive: true,
      });

    if (data.procedureName) {
      query.andWhere('LOWER(procedure.name) LIKE LOWER(:procedureName)', {
        procedureName: `%${data.procedureName}%`,
      });
    }

    if (data.district) {
      query.andWhere('LOWER(village.district) LIKE LOWER(:district)', {
        district: `%${data.district}%`,
      });
    }

    if (data.state) {
      query.andWhere('LOWER(village.state) LIKE LOWER(:state)', {
        state: `%${data.state}%`,
      });
    }

    if (data.icuAvailable === true) {
      query.andWhere('hospital.icuAvailable = true');
    }

    if (data.ambulanceAvailable === true) {
      query.andWhere('hospital.ambulanceAvailable = true');
    }

    if (data.emergencyAvailable === true) {
      query.andWhere('hospital.emergencyAvailable = true');
    }

    return query.getMany();
  }

  async getHospitalDetails(data: ChatIntentData) {
    if (!data.hospitalName) {
      return [];
    }

    return this.hospitalRepository.find({
      where: {
        name: ILike(`%${data.hospitalName}%`),
        isActive: true,
      },

      relations: {
        village: true,
      },
    });
  }

  async getProcedureCost(data: ChatIntentData) {
    const query = this.hospitalProcedureRepository
      .createQueryBuilder('hp')
      .leftJoinAndSelect('hp.hospital', 'hospital')
      .leftJoinAndSelect('hp.procedure', 'procedure')
      .leftJoinAndSelect('hospital.village', 'village')
      .where('hp.isActive = true');

    if (data.procedureName) {
      query.andWhere('LOWER(procedure.name) LIKE LOWER(:procedureName)', {
        procedureName: `%${data.procedureName}%`,
      });
    }

    if (data.hospitalName) {
      query.andWhere('LOWER(hospital.name) LIKE LOWER(:hospitalName)', {
        hospitalName: `%${data.hospitalName}%`,
      });
    }

    if (data.district) {
      query.andWhere('LOWER(village.district) LIKE LOWER(:district)', {
        district: `%${data.district}%`,
      });
    }

    return query.getMany();
  }

  async getSchemeAvailability(data: ChatIntentData) {
    const query = this.hospitalSchemeRepository
      .createQueryBuilder('hs')
      .leftJoinAndSelect('hs.hospital', 'hospital')
      .leftJoinAndSelect('hs.scheme', 'scheme')
      .where('hs.isAvailable = true');

    if (data.hospitalName) {
      query.andWhere('LOWER(hospital.name) LIKE LOWER(:hospitalName)', {
        hospitalName: `%${data.hospitalName}%`,
      });
    }

    if (data.schemeName) {
      query.andWhere('LOWER(scheme.name) LIKE LOWER(:schemeName)', {
        schemeName: `%${data.schemeName}%`,
      });
    }

    return query.getMany();
  }

  async findEmergencyHospitals(data: ChatIntentData) {
    return this.hospitalRepository.find({
      where: {
        isActive: true,

        emergencyAvailable: true,

        ...(data.icuAvailable === true && {
          icuAvailable: true,
        }),

        ...(data.ambulanceAvailable === true && {
          ambulanceAvailable: true,
        }),
      },

      relations: {
        village: true,
      },
    });
  }
}
