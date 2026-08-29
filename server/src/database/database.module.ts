import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvironment } from '../config/configuration.js';
import { Hospital } from './entities/hospital.entity.js';
import { HospitalProcedure } from './entities/hospital-procedure.entity.js';
import { HospitalScheme } from './entities/hospital-scheme.entity.js';
import { Procedure } from './entities/procedure.entity.js';
import { Scheme } from './entities/scheme.entity.js';
import { Village } from './entities/village.entity.js';

const environment = getEnvironment();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.DATABASE_HOST,
      port: environment.DATABASE_PORT,
      username: environment.DATABASE_USERNAME,
      password: environment.DATABASE_PASSWORD,
      database: environment.DATABASE_NAME,
      entities: [
        Village,
        Hospital,
        Procedure,
        HospitalProcedure,
        Scheme,
        HospitalScheme,
      ],
      migrationsRun: false,
      synchronize: false,
    }),
  ],
})
export class DatabaseModule {}
