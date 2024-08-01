import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ViewExceptionFilter } from 'src/commons/filters/view-exception.filter';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthExceptionFilter } from './filters/auth-exceptions.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('login')
  loginView(@Req() req: Request, @Res() res: Response) {
    const message = req.flash('message');
    if (message) return { message };
  }

  @UseFilters(AuthExceptionFilter)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Res() res: Response): any {
    return res.redirect('/');
  }

  @Get('logout')
  logout(@Req() req, @Res() res: Response): void {
    req.session.destroy();
    return res.redirect('/');
  }

  @UseGuards(LocalAuthGuard)
  @Post('jwt')
  async loginJwt(@Req() { user }: { user: User }, @Res() res: Response) {
    const access = await this.authService.loginJwt(user);
    return res.status(200).json(access);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jwt/validate')
  validateJwt(@Res() res: Response) {
    return res.status(200).json();
  }

  @Get('signup')
  @Render('signup')
  signup(@Res() res: Response): any {}

  @Post('signup')
  @UseFilters(ViewExceptionFilter)
  async createUserPost(
    @Body() body: CreateUserDto,
    @Res() res: Response,
  ): Promise<any> {
    await this.authService.signUp(body);
    return res.redirect('/');
  }
}
