import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as exphbs from 'express-handlebars';
import * as passport from 'passport';
import { join } from 'path';
import { AppModule } from './app.module';
import { postgresConfig } from './commons/configs/postgres.config';
import { FormValidationException } from './commons/exceptions/form-validation.exception';
import * as handlebarsHelpers from './commons/handlebars-helpers';
import { ViewContextInterceptor } from './commons/interceptors/view-context.interceptor';
import session = require('express-session');
import flash = require('connect-flash');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new ViewContextInterceptor());

  // Força validação de DTOs nos controllers
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: FormValidationException.exceptionFactory,
    }),
  );

  app.engine(
    '.hbs',
    exphbs.create({
      extname: '.hbs',
      defaultLayout: 'main',
      helpers: handlebarsHelpers,
    }).engine,
  );
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.useStaticAssets(join(__dirname, '..', 'node_modules/bootstrap/dist'));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(+process.env.PORT ?? 3000);
}

postgresConfig();

bootstrap();
