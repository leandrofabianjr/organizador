import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtConfig from 'src/commons/configs/jwt.config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: JwtConfig().secret,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const user = await this.usersService.get(userId);
    if (user) {
      delete user.password;
      return user;
    }
    return null;
  }
}
