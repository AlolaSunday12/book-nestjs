import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enables automatic transformation
      whitelist: true, // Removes unexpected fields
      forbidNonWhitelisted: true, // Throws an error for unexpected fields
    }),
  );

  app.use('/uploads', express.static(join(__dirname, '..', 'public/uploads')));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
