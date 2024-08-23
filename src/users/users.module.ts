import { Module } from '@nestjs/common';
import { UsersProvider } from './users.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...UsersProvider, UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Add this line
})
export class UsersModule {}
