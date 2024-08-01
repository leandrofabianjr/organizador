import { ValidationError } from '@nestjs/common';
import { ViewException } from './view.exception';

export class FormValidationException extends ViewException {
  constructor(public errors: ValidationError[]) {
    super({ message: 'Por favor, revise os dados' });
  }

  static exceptionFactory(errors: ValidationError[]) {
    return new FormValidationException(errors);
  }
}
