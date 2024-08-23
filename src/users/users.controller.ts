import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(user);
  }

  @Delete()
  async deleteAllUsers(): Promise<void> {
    return this.usersService.removeAll();
  }

  @Delete('/:id')
  async deleteUser(@Param() id: number): Promise<void> {
    return this.usersService.remove(id);
  }
  @Get('/:id')
  async getUser(@Param() id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post('/:id')
  async updateUser(@Param() id: number, @Body() user: User) {
    return this.usersService.update(id, user);
  }
}
