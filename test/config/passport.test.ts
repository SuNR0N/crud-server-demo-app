import {
  Request,
  Response,
} from 'express';
import passport, { Profile } from 'passport';

import {
  configurePassort,
  isAuthenticated,
} from '../../src/config/passport';
import { User } from '../../src/entities/User';
import { EntityNotFoundError } from '../../src/errors';
import { UserService } from '../../src/services';

describe('passport', () => {
  describe('configurePassort', () => {
    const environmentVariables = process.env;
    let createUserMock: jest.Mock;
    let getUserMock: jest.Mock;
    let userServiceMock: UserService;

    beforeEach(async () => {
      jest.resetModules();
      process.env = { ...environmentVariables };
      createUserMock = jest.fn();
      getUserMock = jest.fn();
      userServiceMock = {
        createUser: createUserMock,
        getUser: getUserMock,
      } as any as UserService;
    });

    afterEach(() => {
      process.env = environmentVariables;
    });

    it('should use GitHubStrategy by default', async () => {
      process.env.NODE_ENV = 'development';
      const GitHubStrategyConstructor = jest.fn(() => ({ name: 'github' }));
      jest.doMock('passport-github', () => ({ Strategy: GitHubStrategyConstructor }));
      const { configurePassort: configurePassortDynamic } = await import('../../src/config/passport');
      configurePassortDynamic(passport, userServiceMock as any);

      expect(GitHubStrategyConstructor).toHaveBeenCalled();
    });

    it('should use MockStrategy in "test" mode', async () => {
      process.env.NODE_ENV = 'test';
      const MockStrategyConstructor = jest.fn(() => ({ name: 'github' }));
      jest.doMock('../../src/util/MockStrategy', () => ({ MockStrategy: MockStrategyConstructor }));
      const { configurePassort: configurePassortDynamic } = await import('../../src/config/passport');
      configurePassortDynamic(passport, userServiceMock as any);

      expect(MockStrategyConstructor).toHaveBeenCalled();
    });

    describe('verify', () => {
      const user = {} as User;
      let doneSpy: jest.Mock;
      let verify: (
        _accessToken: string | null,
        _refreshToken: string | null,
        profile: Profile,
        done: (err: any, user?: User) => void,
      ) => void;

      beforeEach(() => {
        configurePassort(passport, userServiceMock as any);
        verify = (passport as any)._strategies.github._cb;
        doneSpy = jest.fn();
      });

      it('should use an existing user from the db during the verification if it exists', async () => {
        getUserMock.mockReturnValueOnce(user);

        await verify(null, null, { id: '123' } as Profile, doneSpy);

        expect(getUserMock).toHaveBeenCalledWith(123);
        expect(doneSpy).toHaveBeenCalledWith(null, user);
      });

      it('should create a new user during the verification if no user exists with the given id', async () => {
        getUserMock.mockImplementationOnce(() => {
          throw new EntityNotFoundError<User>(User, 123);
        });
        createUserMock.mockReturnValueOnce(user);

        await verify(
          null,
          null,
          {
            displayName: 'John Doe',
            emails: [
              { value: 'john.doe@dummy.com' },
            ],
            id: '123',
            photos: [
              { value: 'http://www.example.com/J0hn_D03.jpg' },
            ],
            provider: 'github',
            username: 'J0hn_D03',
          } as Profile,
          doneSpy,
        );

        expect(createUserMock).toHaveBeenCalledWith(expect.objectContaining({
          avatarUrl: 'http://www.example.com/J0hn_D03.jpg',
          email: 'john.doe@dummy.com',
          id: 123,
          name: 'John Doe',
          username: 'J0hn_D03',
        }));
        expect(doneSpy).toHaveBeenCalledWith(null, user);
      });

      it('should call the done callback with the error in case of an unknown error', async () => {
        const unknownError = new Error('Unknown');
        getUserMock.mockImplementationOnce(() => {
          throw unknownError;
        });

        await verify(null, null, {} as Profile, doneSpy);

        expect(doneSpy).toHaveBeenCalledWith(unknownError);
      });
    });

    describe('serializeUser', () => {
      it('should serialize the user using its id', () => {
        configurePassort(passport, userServiceMock as any);
        const serializers: any[] = (passport as any)._serializers;
        const serializer: (user: User, done: any) => void = serializers[serializers.length - 1];
        const user = { id: 1 } as User;
        const doneSpy = jest.fn();

        serializer(user, doneSpy);

        expect(doneSpy).toHaveBeenCalledWith(null, 1);
      });
    });

    describe('deserializeUser', () => {
      let deserializer: (id: number, done: any) => void;
      let doneSpy: jest.Mock;

      beforeEach(() => {
        configurePassort(passport, userServiceMock as any);
        const deserializers: any[] = (passport as any)._deserializers;
        deserializer = deserializers[deserializers.length - 1];
        doneSpy = jest.fn();
      });

      it('should deserialize the user by fetching the entity from the db by its id', async () => {
        const user = {} as User;
        getUserMock.mockReturnValueOnce(user);

        await deserializer(1, doneSpy);

        expect(getUserMock).toHaveBeenCalledWith(1);
        expect(doneSpy).toHaveBeenCalledWith(null, user);
      });

      it('should throw an error during the deserializtion if no user exists with the given id', async () => {
        const unknownError = new Error('Unknown');
        getUserMock.mockImplementationOnce(() => {
          throw unknownError;
        });

        await deserializer(1, doneSpy);

        expect(getUserMock).toHaveBeenCalledWith(1);
        expect(doneSpy).toHaveBeenCalledWith(unknownError);
      });
    });
  });

  describe('isAuthenticated', () => {
    let isAuthenticatedMock: jest.Mock;
    let request: Request;

    beforeEach(() => {
      isAuthenticatedMock = jest.fn();
      request = {
        isAuthenticated: isAuthenticatedMock,
      } as any as Request;
    });

    it('should call the next function if the request is authenticated', () => {
      const nextSpy = jest.fn();
      isAuthenticatedMock.mockReturnValueOnce(true);
      isAuthenticated(request, {} as Response, nextSpy);

      expect(nextSpy).toHaveBeenCalled();
    });

    it('should set the forbidden status on the response if the request is not authenticated', () => {
      const sendStatusSpy = jest.fn();
      const response = {
        sendStatus: sendStatusSpy,
      } as any as Response;
      isAuthenticatedMock.mockReturnValueOnce(false);

      isAuthenticated(request, response, jest.fn());

      expect(sendStatusSpy).toHaveBeenCalledWith(403);
    });
  });
});
