import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { ViewExceptionOptions } from '../decorators/view-exception-options.decorator';
import { FormValidationException } from '../exceptions/form-validation.exception';
import { ViewException } from '../exceptions/view.exception';

export interface ViewExceptionFilterOptions {
  view: string;
  renderOptions?: Object;
}

@Catch()
export class ViewExceptionFilter implements ExceptionFilter {
  constructor(private reflector: Reflector) {}

  catch(exception: any, host: ArgumentsHost) {
    const filterOptions = this.reflector.get(
      ViewExceptionOptions,
      host.getArgs,
    );
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const renderOptions = {};

    if (exception instanceof FormValidationException) {
      const errors = exception.errors;
      const values = errors?.[0]?.['target'];
      const form = { errors, values };
      renderOptions['form'] = form;
    } else if (exception instanceof ViewException) {
      renderOptions['message'] = exception.message;
    } else {
      renderOptions['message'] =
        `Erro desconhecido: (${exception?.toString()})`;
    }

    // return response.render(this.filterOptions.view, {
    //   ...renderOptions,
    //   ...(this.options.renderOptions ?? {}),
    // });
  }
}
