import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    const email = process.env.DEFAUL_ADMIN_EMAIL;
    const admin = await this.usersService.findOneByEmail(email);
    if (!admin) {
      this.usersService.create({
        email,
        name: 'Administrador',
        password: await this.hash(process.env.DEFAUL_ADMIN_PASSW),
        passwordConfirm: '',
      });
    }
  }

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, SALT_ROUNDS);
  }

  async signUp(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hash(dto.password);
    dto.password = dto.passwordConfirm = '';
    dto.password = hashedPassword;
    const user = this.usersService.create(dto);
    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user?.password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async loginJwt(user: User) {
    const payload = { sub: user.id };
    return {
      access: this.jwtService.sign(payload),
      user,
    };
  }
}
