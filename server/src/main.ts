import 'reflect-metadata';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { getEnvironment } from './config/configuration.js';

const environment = getEnvironment();
const app = await NestFactory.create(AppModule, { cors: true });
app.use(helmet());
app.setGlobalPrefix('api/v1');
const swaggerConfig = new DocumentBuilder()
  .setTitle('Healthcare Hospital Discovery API')
  .setVersion('1.0')
  .build();
SwaggerModule.setup(
  '/api/docs',
  app,
  SwaggerModule.createDocument(app, swaggerConfig),
);
await app.listen(environment.PORT);
