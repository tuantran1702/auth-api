import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

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
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async createManyUsers(users: CreateUserDto[]): Promise<User[]> {
    const newUsers = this.usersRepository.create(users);
    return this.usersRepository.save(newUsers);
  }
}
