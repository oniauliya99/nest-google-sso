import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());

  const swaggerTheme = new SwaggerTheme();
  const config = new DocumentBuilder()
    .setTitle('Single Sign On')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/sso/spec', app, document, {
    customCss: swaggerTheme.getBuffer(SwaggerThemeNameEnum.NORD_DARK),
  });

  process.on('beforeExit', async () => app.close());
  await app.listen(3000);
  const appURL = await app.getUrl();
  Logger.log(`ON ${appURL}`, 'Single Sign On Service');
}

bootstrap();
