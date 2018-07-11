import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { FORBIDDEN } from 'http-status-codes';
import {
  PassportStatic,
  Profile,
  Strategy,
} from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';

import { UserDTO } from '../dtos/UserDTO';
import { User } from '../entities/User';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { UserService } from '../services/UserService';
import { MockStrategy } from '../util/MockStrategy';
import { Configuration } from './config';

export function configurePassort(passport: PassportStatic, userService: UserService) {
  const strategyForEnvironment = (): Strategy => {
    let strategy: Strategy;
    switch (process.env.NODE_ENV) {
      case 'test':
        strategy = new MockStrategy('github', verify);
        break;
      default:
        strategy = new GitHubStrategy({
          callbackURL: Configuration.GITHUB_CALLBACK_URL,
          clientID: Configuration.GITHUB_CLIENT_ID,
          clientSecret: Configuration.GITHUB_CLIENT_SECRET,
        }, verify);
        break;
    }
    return strategy;
  };

  const verify = async (
    _accessToken: string | null,
    _refreshToken: string | null,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): Promise<void> => {
    let user: User;
    try {
      user = await userService.getUser(Number(profile.id));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        const dto = new UserDTO(profile);
        user = await userService.createUser(dto);
      } else {
        return done(error);
      }
    }
    return done(null, user!);
  };

  passport.use(strategyForEnvironment());

  passport.serializeUser((user: User, done) => done(null, user.id));

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await userService.getUser(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.sendStatus(FORBIDDEN);
  }
}
