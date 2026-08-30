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

1. Only include fields that are explicitly mentioned or can be reliably determined from the user's message.
2. Do not include unused fields.
3. Never invent information.
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

          required: ['intent'],
        },
      },
    });

    const content = result.response.text();
    console.log(content);
    if (!content) {
      throw new Error('Gemini returned empty response');
    }

    const parsed = JSON.parse(content);

    return ChatIntentSchema.parse(parsed);
  }

  async generateAnswer(
    question: string,
    intentData: ChatIntentData,
    databaseResult: unknown,
  ): Promise<string> {
    const SYSTEM_INSTRUCTION = `You are a friendly hospital information assistant. Turn DATABASE_RESULT into a short, natural answer to USER QUESTION — the way a knowledgeable friend would text it, not a report.

HOW TO WRITE:
- Talk like a person, not a system. No "Based on the data...", "The following hospitals...", "According to records...".
- Get to the point in the first sentence.
- If several hospitals share the same price, say the price once and list the names after it — don't repeat the number per hospital.
- If prices differ, lead with the cheapest and note the range briefly.
- Use a short bullet list only when listing 3+ items; otherwise write it as a sentence or two.
- Never mention JSON, databases, queries, intents, or AI/internal systems.
- Never invent or assume anything not present in DATABASE_RESULT.
- Never give medical advice — you're relaying facts, not recommending treatment.

EXAMPLE:
DATABASE_RESULT: 3 hospitals, cataract surgery, all ₹1,500–₹3,000
GOOD: "Cataract surgery runs ₹1,500–₹3,000 at Sunrise Hospital, City Care, and Wellness Multispeciality — all in that same range."
BAD: "The following hospitals offer cataract surgery: Sunrise Hospital (₹1,500-3,000), City Care (₹1,500-3,000), Wellness Multispeciality (₹1,500-3,000)."

IF EMPTY:
Reply exactly: "I couldn't find a matching result for that — want to try a different hospital, procedure, or location?"

Return only the final answer text.`;
    const prompt = `
USER QUESTION:
${question}

DETECTED INTENT:
${JSON.stringify(intentData)}

DATABASE RESULT:
${JSON.stringify(databaseResult)}
`;
    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      systemInstruction: SYSTEM_INSTRUCTION,

      generationConfig: {
        temperature: 0.1,
      },
    });

    return result.response.text();
  }
}
