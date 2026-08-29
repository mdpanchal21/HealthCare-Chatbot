import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotService } from './chatbot.service.js';
import { ChatbotController } from './chatbot.controller.js';
import { ChatQueryService } from './services/chat-query/chat-query.service.js';
import { AiService } from './services/ai/ai.service.js';
import { HospitalProcedure } from '../../database/entities/hospital-procedure.entity.js';
import { Hospital } from '../../database/entities/hospital.entity.js';
import { Scheme } from '../../database/entities/scheme.entity.js';
import { HospitalScheme } from '../../database/entities/hospital-scheme.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([HospitalProcedure, Hospital, HospitalScheme])],
  providers: [ChatbotService, ChatQueryService, AiService],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
