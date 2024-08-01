import { Reflector } from '@nestjs/core';
import { ViewExceptionFilterOptions } from '../filters/view-exception.filter';

export const ViewExceptionOptions =
  Reflector.createDecorator<ViewExceptionFilterOptions>();
