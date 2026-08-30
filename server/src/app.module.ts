import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { HospitalsModule } from './modules/hospitals/hospitals.module.js';
import { HospitalProceduresModule } from './modules/hospital-procedures/hospital-procedures.module.js';
import { HospitalSchemesModule } from './modules/hospital-schemes/hospital-schemes.module.js';
import { ProceduresModule } from './modules/procedures/procedures.module.js';
import { SchemesModule } from './modules/schemes/schemes.module.js';
import { VillagesModule } from './modules/villages/villages.module.js';
import { HealthController } from './health.controller.js';
import { ChatbotModule } from './modules/chatbot/chatbot.module.js';

@Module({
  controllers: [HealthController],
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    DatabaseModule,
    VillagesModule,
    HospitalsModule,
    ProceduresModule,
    SchemesModule,
    HospitalProceduresModule,
    HospitalSchemesModule,
    ChatbotModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
