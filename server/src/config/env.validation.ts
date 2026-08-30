import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().max(65535).default(3000),
  DATABASE_HOST: z.string().min(1).default('localhost'),
  DATABASE_PORT: z.coerce.number().int().positive().default(5432),
  DATABASE_USERNAME: z.string().min(1).default('postgres'),
  DATABASE_PASSWORD: z.string().default(''),
  DATABASE_NAME: z.string().min(1).default('healthcare_db'),
});

export type Environment = z.infer<typeof envSchema>;

export function validateEnvironment(
  input: Record<string, unknown>,
): Environment {
  return envSchema.parse(input);
}
