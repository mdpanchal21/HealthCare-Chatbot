import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { getEnvironment } from '../config/configuration.js';
import { Hospital } from './entities/hospital.entity.js';
import { HospitalProcedure } from './entities/hospital-procedure.entity.js';
import { HospitalScheme } from './entities/hospital-scheme.entity.js';
import { Procedure } from './entities/procedure.entity.js';
import { Scheme } from './entities/scheme.entity.js';
import { Village } from './entities/village.entity.js';

const environment = getEnvironment();

export default new DataSource({
  type: 'postgres',
  host: environment.DATABASE_HOST,
  port: environment.DATABASE_PORT,
  username: environment.DATABASE_USERNAME,
  password: environment.DATABASE_PASSWORD,
  database: environment.DATABASE_NAME,
  entities: [Village, Hospital, HospitalProcedure, HospitalScheme, Procedure, Scheme],
  migrations: ['src/database/migrations/*.{ts,js}'],
  synchronize: false,
});