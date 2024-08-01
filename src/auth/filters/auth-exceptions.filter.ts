import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    switch (true) {
      case exception instanceof UnauthorizedException:
        if (request.url == '/auth/login' && request.accepts('text/html')) {
          return response.render('login', {
            message: 'E-mail ou senha inválidos',
          });
        }
    }
  }
}
