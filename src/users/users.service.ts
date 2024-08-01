import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/commons/base-classes/base.service';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<User, CreateUserDto> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  async buildPartial(dto: CreateUserDto): Promise<DeepPartial<User>> {
    return dto;
  }

  findOneByEmail(email: string): Promise<User> {
    return this.repository.findOne({ where: { email } });
  }
}
