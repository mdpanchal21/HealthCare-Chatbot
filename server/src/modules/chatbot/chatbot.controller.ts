import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ChatbotService } from './chatbot.service.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});
@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
  ) {}

  @Post()
  async chat(@Body(new ZodValidationPipe(chatSchema)) body: unknown) {
    return this.chatbotService.chat((body as { message: string }).message);
  }
}