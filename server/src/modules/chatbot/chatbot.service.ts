import { Injectable } from '@nestjs/common';
import { AiService } from './services/ai/ai.service.js';
import { ChatQueryService } from './services/chat-query/chat-query.service.js';
import { ChatIntent } from './types/chat-intent.enum.js';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly aiService: AiService,
    private readonly chatQueryService: ChatQueryService,
  ) {}

  async chat(message: string) {
    const intentData = await this.aiService.extractIntent(message);

    let result;

    switch (intentData.intent) {
      case ChatIntent.FIND_HOSPITAL:
        result = await this.chatQueryService.findHospitals(intentData);
        break;

      case ChatIntent.HOSPITAL_DETAILS:
        result = await this.chatQueryService.getHospitalDetails(intentData);
        break;

      case ChatIntent.PROCEDURE_COST:
      case ChatIntent.PROCEDURE_COST_BREAKDOWN:
        result = await this.chatQueryService.getProcedureCost(intentData);
        break;

      case ChatIntent.SCHEME_AVAILABILITY:
      case ChatIntent.FIND_SCHEME:
        result = await this.chatQueryService.getSchemeAvailability(intentData);
        break;

      case ChatIntent.FIND_EMERGENCY_HOSPITAL:
        result = await this.chatQueryService.findEmergencyHospitals(intentData);
        break;

      default:
        return {
          success: true,

          intent: intentData.intent,

          message: 'Sorry, I could not understand your request.',

          data: [],
        };
    }

    return {
      success: true,

      intent: intentData.intent,

      query: intentData,

      data: result,
    };
  }
}
