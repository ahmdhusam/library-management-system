import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // To validate incoming request body
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // For Headers
  app.enableCors();
  app.use(helmet());

  app.use(compression());

  // Configure Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('A Library API')
    .setVersion('1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = config.get('PORT');
  await app.listen(PORT);
  logger.log(`Listening at Port ${PORT}`);
}
bootstrap();
