import { z } from 'zod';
import { ChatIntent } from '../types/chat-intent.enum.js'; 

export const ChatIntentSchema = z.object({
  intent: z.nativeEnum(ChatIntent),

  hospitalName: z.string().nullable().default(null),

  procedureName: z.string().nullable().default(null),

  schemeName: z.string().nullable().default(null),

  village: z.string().nullable().default(null),

  district: z.string().nullable().default(null),

  state: z.string().nullable().default(null),

  emergencyAvailable: z.boolean().nullable().default(null),

  icuAvailable: z.boolean().nullable().default(null),

  ambulanceAvailable: z.boolean().nullable().default(null),
});

export type ChatIntentData = z.infer<typeof ChatIntentSchema>;