import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Creating swagger documentation
  const options = new DocumentBuilder()
    .setTitle('weather-api')
    .setDescription('API responsible for retrieving weather information')
    .setVersion('0.0.1')
    .setLicense('MIT', 'https://mit-license.org/')
    // Adding configuration servers
    .addServer(`http://localhost:3000`)
    // Adding tags for each API resources (this tags relates to @ApiTags param)
    .addTag('weather-api')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const swaggerPath = 'v1/weather-api/documentation/api';
  SwaggerModule.setup(swaggerPath, app, document);
  logger.log(
    `Serving Open API documentation at http://localhost:3000/${swaggerPath}`,
  );

  await app.listen(3000);
}
bootstrap();
