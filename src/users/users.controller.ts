import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('user')
  async createUser(@Body() user: User): Promise<User> {
    return this.usersService.createUser(user);
  }

  @Delete('user/:id')
  async deleteUser(@Param() id: number): Promise<void> {
    return this.usersService.remove(id);
  }

  @Delete('users')
  async deleteAllUsers(): Promise<void> {
    return this.usersService.removeAll();
  }

  @Post('users')
  async createManyUsers(@Body() users: User[]): Promise<User[]> {
    return this.usersService.createManyUsers(users);
  }
  @Get('user/:id')
  async getUser(@Param() id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get('users/:id')
  async getUserById(@Param() id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post('users/:id')
  async updateUser(@Param() id: number, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Delete('users/:id')
  async deleteUserById(@Param() id: number) {
    return this.usersService.remove(id);
  }
}
