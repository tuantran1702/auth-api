import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { UsersProvider } from './users.providers';
import { DatabaseModule } from '../database/database.module';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import {
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let module: TestingModule;
  let dataSource: DataSource;
  let userRepository: Repository<User>;
  let app: INestApplication;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [DatabaseModule],
      providers: [...UsersProvider, UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    dataSource = module.get<DataSource>('DATA_SOURCE');
    userRepository = module.get<Repository<User>>('USERS_REPOSITORY');

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // <- This addition
    await app.init();

    // Clear the database before each test
    await userRepository.clear();
  });

  afterEach(async () => {
    await controller.deleteAllUsers();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const user1: User = {
        id: 1,
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
      };
      const user2: User = {
        id: 2,
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password456',
      };

      await controller.createUser(user1);
      await controller.createUser(user2);

      const users = await controller.getUsers();

      expect(users).toHaveLength(2);
      expect(users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: user1.username,
            email: user1.email,
          }),
          expect.objectContaining({
            username: user2.username,
            email: user2.email,
          }),
        ]),
      );
      users.forEach((user) => {
        expect(user.id).toBeDefined();
        expect(user.password).toBeDefined();
      });
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const createdUser = await controller.createUser(user);
      const foundUser = await controller.getUser(createdUser.id);

      expect(foundUser).toEqual(
        expect.objectContaining({
          username: user.username,
          email: user.email,
        }),
      );
      expect(foundUser.id).toBeDefined();
      expect(foundUser.password).toBeDefined();
    });

    it('should return null for non-existent user', async () => {
      const foundUser = await controller.getUser(999);
      expect(foundUser).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: CreateUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword',
      };

      const createdUser = await controller.createUser(user);

      expect(createdUser).toEqual(
        expect.objectContaining({
          username: user.username,
          email: user.email,
        }),
      );
      expect(createdUser.id).toBeDefined();
      expect(createdUser.password).toBeDefined();
    });

    // it('should fail, password too short', async () => {
    //   const user: CreateUserDto = {
    //     username: 'newuser',
    //     email: 'new1@example.com',
    //     password: '123',
    //   };

    //   await expect(controller.createUser(user)).rejects.toThrow(ValidationPipe);
    // });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const user: User = {
        id: 1,
        username: 'updateuser',
        email: 'update@example.com',
        password: 'updatepassword',
      };

      const createdUser = await controller.createUser(user);

      const updatedData: User = {
        id: createdUser.id,
        username: 'updateduser',
        email: 'updated@example.com',
        password: 'updatedpassword',
      };

      await controller.updateUser(createdUser.id, updatedData);

      const updatedUser = await controller.getUser(createdUser.id);

      expect(updatedUser).toEqual(
        expect.objectContaining({
          username: updatedData.username,
          email: updatedData.email,
        }),
      );
      expect(updatedUser.id).toBe(createdUser.id);
      expect(updatedUser.password).toBeDefined();
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      const user: User = {
        id: 1,
        username: 'deleteuser',
        email: 'delete@example.com',
        password: 'deletepassword',
      };

      const createdUser = await controller.createUser(user);

      await controller.deleteUser(createdUser.id);

      const deletedUser = await controller.getUser(createdUser.id);

      expect(deletedUser).toBeNull();
    });
  });

  describe('deleteAllUsers', () => {
    it('should delete all users', async () => {
      const users: User[] = [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          password: 'pass1',
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@example.com',
          password: 'pass2',
        },
      ];

      await controller.createUser(users[0]);
      await controller.createUser(users[1]);
      await controller.deleteAllUsers();

      const remainingUsers = await controller.getUsers();
      expect(remainingUsers).toHaveLength(0);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by id', async () => {
      const user: User = {
        id: 1,
        username: 'deleteuser',
        email: 'delete@example.com',
        password: 'deletepassword',
      };

      const createdUser = await controller.createUser(user);
      await controller.deleteUser(createdUser.id);

      const deletedUser = await controller.getUser(createdUser.id);
      expect(deletedUser).toBeNull();
    });
  });

  // describe('login', () => {
  //   it('happy case', async () => {
  //     const user: CreateUserDto = {
  //       username: 'bob',
  //       email: 'bob@example.com',
  //       password: 'tuantran',
  //     };

  //     const createdUser = await controller.createUser(user);

  //     // try login

  //     const result = await controller.loginUser({
  //       username: 'bob',
  //       password: 'tuantran',
  //     });
  //     // ensure no exception thrown
  //     expect(result).toBeDefined();
  //     expect(result).toEqual(
  //       expect.objectContaining({
  //         username: user.username,
  //         email: user.email,
  //       }),
  //   );
  // });
  // });
});
