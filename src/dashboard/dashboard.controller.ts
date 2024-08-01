import {
  Controller,
  Get,
  Render,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { ViewExceptionOptions } from 'src/commons/decorators/view-exception-options.decorator';
import { ViewContextInterceptor } from 'src/commons/interceptors/view-context.interceptor';

@Controller('dashboard')
@UseInterceptors(ViewContextInterceptor)
@UseGuards(AuthenticatedGuard)
export class DashboardController {
  @Get('')
  @ViewExceptionOptions({ view: 'dashboard' })
  @Render('dashboard')
  dashboard(@Res() res: Response) {}
}
