import 'dotenv/config';
import { Environment, validateEnvironment } from './env.validation.js';

export function getEnvironment(): Environment {
  return validateEnvironment(process.env);
}