import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get env config
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // ✅ Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws error if unknown props are passed
      transform: true, // transforms payload to DTO class instances
    }),
  );

  // ✅ Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Doc Manager API')
    .setDescription('API documentation for nest-doc-manager backend')
    .setVersion('1.0')
    .addBearerAuth() // JWT support in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document); // http://localhost:3003/api

  // ✅ Start server
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📄 Swagger API Docs: http://localhost:${port}/api`);
}

bootstrap();
