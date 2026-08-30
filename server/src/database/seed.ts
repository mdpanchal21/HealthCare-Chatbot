import dataSource from './data-source.js';
import { Hospital, HospitalType } from './entities/hospital.entity.js';
import { HospitalProcedure } from './entities/hospital-procedure.entity.js';
import { HospitalScheme } from './entities/hospital-scheme.entity.js';
import { Procedure } from './entities/procedure.entity.js';
import { Scheme } from './entities/scheme.entity.js';
import { Village } from './entities/village.entity.js';
import { In } from 'typeorm';

await dataSource.initialize();

const villageRepository = dataSource.getRepository(Village);
const villageNames = ['Dholera', 'Sanand', 'Bavla', 'Mandal', 'Viramgam'].map(
  (name) => `${name} DEMO DATA`,
);
await villageRepository.upsert(
  villageNames.map((name) => ({
    name,
    district: 'Ahmedabad DEMO DATA',
    state: 'Gujarat',
  })),
  ['name', 'district', 'state'],
);
const villages = await villageRepository.findBy({ name: In(villageNames) });

const hospitalRepository = dataSource.getRepository(Hospital);
await hospitalRepository.upsert(
  villages.map((village, index) => ({
    name: `Community Hospital ${index + 1} DEMO DATA`,
    hospitalType: index % 2 ? HospitalType.PRIVATE : HospitalType.GOVERNMENT,
    villageId: village.id,
    address: `Main Road, ${village.name}`,
    district: village.district,
    state: village.state,
    phone: '0000000000',
    emergencyAvailable: index % 2 === 0,
    ambulanceAvailable: true,
  })),
  ['name', 'villageId'],
);
const hospitals = await hospitalRepository.find({ order: { name: 'ASC' } });

const procedureRepository = dataSource.getRepository(Procedure);
const procedureNames = [
  'General Consultation',
  'Blood Test',
  'X-Ray',
  'Ultrasound',
  'CT Scan',
  'Appendix Surgery',
  'Hernia Surgery',
  'Cataract Surgery',
  'Delivery',
  'Dialysis',
].map((name) => `${name} DEMO DATA`);
await procedureRepository.upsert(
  procedureNames.map((name) => ({
    name,
    category: 'General healthcare DEMO DATA',
  })),
  ['name'],
);
const procedures = await procedureRepository.find({ order: { name: 'ASC' } });

const schemeRepository = dataSource.getRepository(Scheme);
const schemeData = [
  { name: 'Ayushman Bharat PM-JAY DEMO DATA', state: 'Gujarat' },
  { name: 'MA Amrutam DEMO DATA', state: 'Gujarat' },
  { name: 'State Government Healthcare Scheme DEMO DATA', state: 'Gujarat' },
];
await schemeRepository.upsert(schemeData, ['name', 'state']);
const schemes = await schemeRepository.find({ order: { name: 'ASC' } });

const hospitalProcedureRepository = dataSource.getRepository(HospitalProcedure);
await hospitalProcedureRepository.upsert(
  hospitals.flatMap((hospital) =>
    procedures
      .slice(0, 3)
      .map((procedure, procedureIndex) => ({
        hospitalId: hospital.id,
        procedureId: procedure.id,
        priceMin: (procedureIndex + 1) * 500,
        priceMax: (procedureIndex + 1) * 1000,
        notes: 'Approximate DEMO DATA estimate',
      })),
  ),
  ['hospitalId', 'procedureId'],
);
const hospitalSchemeRepository = dataSource.getRepository(HospitalScheme);
await hospitalSchemeRepository.upsert(
  hospitals.flatMap((hospital, index) =>
    schemes.map((scheme, schemeIndex) => ({
      hospitalId: hospital.id,
      schemeId: scheme.id,
      isAvailable: (index + schemeIndex) % 2 === 0,
      notes: 'DEMO DATA - verify with hospital',
    })),
  ),
  ['hospitalId', 'schemeId'],
);

console.log('Demo seed completed. All inserted records are marked DEMO DATA.');
await dataSource.destroy();
