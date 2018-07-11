import { UserDTO } from '../../src/dtos/UserDTO';
import { User } from '../../src/entities/User';
import { UserService } from '../../src/services/UserService';

describe('UserService', () => {
  const userEntity = {} as User;
  const id = 1;
  let userService: UserService;
  let userRepository: {
    create: jest.Mock,
    findOne: jest.Mock,
    save: jest.Mock,
  };

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    userService = new UserService(userRepository as any);
  });

  describe('createUser', () => {
    const user = new UserDTO({
      displayName: 'John Doe',
      emails: [
        { value: 'john.doe@dummy.com' },
      ],
      id: '12345',
      photos: [
        { value: 'http://www.exampl.com/avatar.png' },
      ],
      provider: 'github',
      username: 'J0hn_D03',
    });

    it('should create a new repository entity from the DTO', () => {
      userService.createUser(user);

      expect(userRepository.create).toHaveBeenCalledWith(user);
    });

    it('should should save the entity to the repository', () => {
      userRepository.create.mockImplementationOnce(() => userEntity);
      userService.createUser(user);

      expect(userRepository.save).toHaveBeenCalledWith(userEntity);
    });
  });

  describe('getUser', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      userRepository.findOne.mockImplementationOnce(() => undefined);

      expect(userService.getUser(id)).rejects
        .toThrow('User with ID = 1 does not exist');
    });

    it('should return the entity with the given id if it is found', async () => {
      userRepository.findOne.mockImplementationOnce(() => userEntity);

      const entity = await userService.getUser(id);
      expect(entity).toBe(userEntity);
    });
  });
});
