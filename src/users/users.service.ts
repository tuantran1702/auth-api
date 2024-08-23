import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { comparePassword, hashPassword } from '../utils/password.utils';
import { LoginDto } from './dto/login.dto';
import { log } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
  ) {}

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: id });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  update(id: number, user: CreateUserDto) {
    return this.usersRepository.update(id, user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.usersRepository.clear();
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const password = await hashPassword(user.password);
    const newUser = this.usersRepository.create({
      ...user,
      password,
    });
    return this.usersRepository.save(newUser);
  }

  async login(loginData: LoginDto) {
    const username = loginData.username;
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    if (user) {
      const valid = comparePassword(user.password, loginData.password);
      if (valid) {
        // TODO: should return jwt
        return user;
      }
    }
    return new UnauthorizedException('Invalid Credentials');
  }
}
