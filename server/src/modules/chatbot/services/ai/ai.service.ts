import { Injectable } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  SchemaType,
} from '@google/generative-ai';
import {
  ChatIntentSchema,
  ChatIntentData,
} from '../../schemas/chat-intent.schema.js';

@Injectable()
export class AiService {
  private readonly gemini: GoogleGenerativeAI;
  private readonly model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.gemini = new GoogleGenerativeAI(apiKey);
    this.model = this.gemini.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    });
  }

  async extractIntent(message: string): Promise<ChatIntentData> {
    const SYSTEM_INSTRUCTION = `
You are an intent extraction system for a hospital information chatbot.

Analyze the user's message and extract the user's intent and relevant entities.

Available intents:

- FIND_HOSPITAL
- HOSPITAL_DETAILS
- PROCEDURE_COST
- PROCEDURE_COST_BREAKDOWN
- FIND_SCHEME
- SCHEME_AVAILABILITY
- FIND_EMERGENCY_HOSPITAL
- GENERAL_QUERY
- UNKNOWN

Extract these fields:

hospitalName
procedureName
schemeName
village
district
state
emergencyAvailable
icuAvailable
ambulanceAvailable

Rules:

1. Return null when a field is not mentioned or cannot be determined.
2. Do not invent information.
3. intent must be exactly one of the available intents.
4. emergencyAvailable, icuAvailable, and ambulanceAvailable must be
   true, false, or null.
5. Extract location information when explicitly mentioned.
6. Return only JSON matching the provided schema.
`;

    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            intent: {
              type: SchemaType.STRING,
              enum: [
                'FIND_HOSPITAL',
                'HOSPITAL_DETAILS',
                'PROCEDURE_COST',
                'PROCEDURE_COST_BREAKDOWN',
                'FIND_SCHEME',
                'SCHEME_AVAILABILITY',
                'FIND_EMERGENCY_HOSPITAL',
                'GENERAL_QUERY',
                'UNKNOWN',
              ],
            },
            hospitalName: {
              type: SchemaType.STRING,
              nullable: true,
            },
            procedureName: {
              type: SchemaType.STRING,
              nullable: true,
            },
            schemeName: {
              type: SchemaType.STRING,
              nullable: true,
            },
            village: {
              type: SchemaType.STRING,
              nullable: true,
            },
            district: {
              type: SchemaType.STRING,
              nullable: true,
            },
            state: {
              type: SchemaType.STRING,
              nullable: true,
            },
            emergencyAvailable: {
              type: SchemaType.BOOLEAN,
              nullable: true,
            },
            icuAvailable: {
              type: SchemaType.BOOLEAN,
              nullable: true,
            },
            ambulanceAvailable: {
              type: SchemaType.BOOLEAN,
              nullable: true,
            },
          },
          required: [
            'intent',
            'hospitalName',
            'procedureName',
            'schemeName',
            'village',
            'district',
            'state',
            'emergencyAvailable',
            'icuAvailable',
            'ambulanceAvailable',
          ],
        },
      },
    });

    const content = result.response.text();

    if (!content) {
      throw new Error('Gemini returned empty response');
    }

    const parsed = JSON.parse(content);

    return ChatIntentSchema.parse(parsed);
  }
}
