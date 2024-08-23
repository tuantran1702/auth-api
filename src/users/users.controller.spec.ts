import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { UsersProvider } from './users.providers';
import { DatabaseModule } from '../database/database.module';
import { DataSource, Repository } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let module: TestingModule;
  let dataSource: DataSource;
  let userRepository: Repository<User>;

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

    // // Clear the database before each test
    // await userRepository.clear();
  });

  //   afterEach(async () => {
  //     await controller.deleteAllUsers();
  //   });

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
            password: user1.password,
          }),
          expect.objectContaining({
            username: user2.username,
            email: user2.email,
            password: user2.password,
          }),
        ]),
      );
      users.forEach((user) => {
        expect(user.id).toBeDefined();
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
          password: user.password,
        }),
      );
      expect(foundUser.id).toBeDefined();
    });

    it('should return null for non-existent user', async () => {
      const foundUser = await controller.getUser(999);
      expect(foundUser).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: User = {
        id: 1,
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword',
      };

      const createdUser = await controller.createUser(user);

      expect(createdUser).toEqual(
        expect.objectContaining({
          username: user.username,
          email: user.email,
          password: user.password,
        }),
      );
      expect(createdUser.id).toBeDefined();
    });
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

      const updatedUser = await controller.getUserById(createdUser.id);

      expect(updatedUser).toEqual(
        expect.objectContaining({
          username: updatedData.username,
          email: updatedData.email,
          password: updatedData.password,
        }),
      );
      expect(updatedUser.id).toBe(createdUser.id);
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

      const deletedUser = await controller.getUserById(createdUser.id);

      expect(deletedUser).toBeNull();
    });
  });

  describe('createManyUsers', () => {
    it('should create multiple users', async () => {
      const users: User[] = [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          password: 'password1',
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@example.com',
          password: 'password2',
        },
        {
          id: 3,
          username: 'user3',
          email: 'user3@example.com',
          password: 'password3',
        },
      ];

      const createdUsers = await controller.createManyUsers(users);

      expect(createdUsers).toHaveLength(3);
      createdUsers.forEach((createdUser, index) => {
        expect(createdUser).toEqual(
          expect.objectContaining({
            username: users[index].username,
            email: users[index].email,
            password: users[index].password,
          }),
        );
        expect(createdUser.id).toBeDefined();
      });
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

      await controller.createManyUsers(users);
      await controller.deleteAllUsers();

      const remainingUsers = await controller.getUsers();
      expect(remainingUsers).toHaveLength(0);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const createdUser = await controller.createUser(user);
      const foundUser = await controller.getUserById(createdUser.id);

      expect(foundUser).toEqual(
        expect.objectContaining({
          username: user.username,
          email: user.email,
          password: user.password,
        }),
      );
      expect(foundUser.id).toBeDefined();
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
      await controller.deleteUserById(createdUser.id);

      const deletedUser = await controller.getUserById(createdUser.id);
      expect(deletedUser).toBeNull();
    });
  });
});
