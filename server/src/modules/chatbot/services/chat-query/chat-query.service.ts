import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
      .leftJoin('hospital.village', 'village')
      .leftJoin('hospital.procedures', 'hospitalProcedure')
      .leftJoin('hospitalProcedure.procedure', 'procedure')
      .select([
        'hospital.id AS "hospitalId"',
        'hospital.name AS "hospitalName"',
        'village.name AS village',
        'village.district AS district',
        'village.state AS state',
        'hospital.emergencyAvailable AS "emergencyAvailable"',
        'hospital.icuAvailable AS "icuAvailable"',
        'hospital.ambulanceAvailable AS "ambulanceAvailable"',
      ])

      .where('hospital.isActive = :isActive', {
        isActive: true,
      });

    // Procedure filter
    if (data.procedureName) {
      query.andWhere('LOWER(procedure.name) LIKE LOWER(:procedureName)', {
        procedureName: `%${data.procedureName}%`,
      });
    }

    // Village filter
    if (data.village) {
      query.andWhere('LOWER(village.name) LIKE LOWER(:village)', {
        village: `%${data.village}%`,
      });
    }

    // District filter
    if (data.district) {
      query.andWhere('LOWER(village.district) LIKE LOWER(:district)', {
        district: `%${data.district}%`,
      });
    }

    // State filter
    if (data.state) {
      query.andWhere('LOWER(village.state) LIKE LOWER(:state)', {
        state: `%${data.state}%`,
      });
    }

    // ICU
    if (data.icuAvailable === true) {
      query.andWhere('hospital.icuAvailable = true');
    }

    // Ambulance
    if (data.ambulanceAvailable === true) {
      query.andWhere('hospital.ambulanceAvailable = true');
    }

    // Emergency
    if (data.emergencyAvailable === true) {
      query.andWhere('hospital.emergencyAvailable = true');
    }

    return query.getRawMany();
  }

  async getHospitalDetails(data: ChatIntentData) {
    if (!data.hospitalName) {
      return [];
    }

    const query = this.hospitalRepository
      .createQueryBuilder('hospital')
      .leftJoin('hospital.village', 'village')
      .select([
        'hospital.id AS "hospitalId"',
        'hospital.name AS "hospitalName"',
        'village.name AS village',
        'village.district AS district',
        'village.state AS state',
        'hospital.emergencyAvailable AS "emergencyAvailable"',
        'hospital.icuAvailable AS "icuAvailable"',
        'hospital.ambulanceAvailable AS "ambulanceAvailable"',
      ])
      .where('hospital.isActive = true')
      .andWhere('LOWER(hospital.name) LIKE LOWER(:hospitalName)', {
        hospitalName: `%${data.hospitalName}%`,
      });

    return query.getRawMany();
  }

  async getProcedureCost(data: ChatIntentData) {
    const query = this.hospitalProcedureRepository
      .createQueryBuilder('hp')
      .leftJoin('hp.hospital', 'hospital')
      .leftJoin('hp.procedure', 'procedure')
      .leftJoin('hospital.village', 'village')
      .select([
        'hospital.name AS "hospitalName"',
        'procedure.name AS "procedureName"',
        'hp.priceMin AS "priceMin"',
        'hp.priceMax AS "priceMax"',
      ])

      .where('hp.isActive = true');

    // Procedure
    if (data.procedureName) {
      query.andWhere('LOWER(procedure.name) LIKE LOWER(:procedureName)', {
        procedureName: `%${data.procedureName}%`,
      });
    }

    // Hospital
    if (data.hospitalName) {
      query.andWhere('LOWER(hospital.name) LIKE LOWER(:hospitalName)', {
        hospitalName: `%${data.hospitalName}%`,
      });
    }

    // Village
    if (data.village) {
      query.andWhere('LOWER(village.name) LIKE LOWER(:village)', {
        village: `%${data.village}%`,
      });
    }

    // District
    if (data.district) {
      query.andWhere('LOWER(village.district) LIKE LOWER(:district)', {
        district: `%${data.district}%`,
      });
    }

    // State
    if (data.state) {
      query.andWhere('LOWER(village.state) LIKE LOWER(:state)', {
        state: `%${data.state}%`,
      });
    }

    return query.getRawMany();
  }

  async getProcedureCostBreakdown(data: ChatIntentData) {
    const query = this.hospitalProcedureRepository
      .createQueryBuilder('hp')
      .leftJoin('hp.hospital', 'hospital')
      .leftJoin('hp.procedure', 'procedure')
      .select([
        'hospital.name AS "hospitalName"',
        'procedure.name AS "procedureName"',
        'hp.priceMin AS "priceMin"',
        'hp.priceMax AS "priceMax"',
        'hp.doctorFee AS "doctorFee"',
        'hp.medicineCost AS "medicineCost"',
        'hp.roomCost AS "roomCost"',
        'hp.otherCharges AS "otherCharges"',
      ])
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

    return query.getRawMany();
  }

  async findSchemes(data: ChatIntentData) {
    const query = this.hospitalSchemeRepository
      .createQueryBuilder('hs')
      .leftJoin('hs.hospital', 'hospital')
      .leftJoin('hs.scheme', 'scheme')
      .leftJoin('hospital.village', 'village')
      .select([
        'scheme.id AS "schemeId"',
        'scheme.name AS "schemeName"',
        'hospital.name AS "hospitalName"',
        'village.name AS village',
        'village.district AS district',
        'village.state AS state',
      ])
      .where('hs.isAvailable = true');

    if (data.schemeName) {
      query.andWhere('LOWER(scheme.name) LIKE LOWER(:schemeName)', {
        schemeName: `%${data.schemeName}%`,
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

    if (data.state) {
      query.andWhere('LOWER(village.state) LIKE LOWER(:state)', {
        state: `%${data.state}%`,
      });
    }

    return query.getRawMany();
  }

  async getSchemeAvailability(data: ChatIntentData) {
    const query = this.hospitalSchemeRepository
      .createQueryBuilder('hs')
      .leftJoin('hs.hospital', 'hospital')
      .leftJoin('hs.scheme', 'scheme')
      .select([
        'hospital.name AS "hospitalName"',
        'scheme.name AS "schemeName"',
        'hs.isAvailable AS "isAvailable"',
      ])

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

    return query.getRawMany();
  }

  async findEmergencyHospitals(data: ChatIntentData) {
    const query = this.hospitalRepository
      .createQueryBuilder('hospital')
      .leftJoin('hospital.village', 'village')
      .select([
        'hospital.id AS "hospitalId"',
        'hospital.name AS "hospitalName"',
        'village.name AS village',
        'village.district AS district',
        'village.state AS state',
        'hospital.emergencyAvailable AS "emergencyAvailable"',
        'hospital.icuAvailable AS "icuAvailable"',
        'hospital.ambulanceAvailable AS "ambulanceAvailable"',
      ])
      .where('hospital.isActive = true')
      .andWhere('hospital.emergencyAvailable = true');

    // ICU requested
    if (data.icuAvailable === true) {
      query.andWhere('hospital.icuAvailable = true');
    }

    // Ambulance requested
    if (data.ambulanceAvailable === true) {
      query.andWhere('hospital.ambulanceAvailable = true');
    }

    // Location
    if (data.village) {
      query.andWhere('LOWER(village.name) LIKE LOWER(:village)', {
        village: `%${data.village}%`,
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

    return query.getRawMany();
  }
}
