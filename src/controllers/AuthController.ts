import {
  Request,
  Response,
} from 'express';
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';
import passport from 'passport';

import { Configuration } from '../config';
import { isAuthenticated } from '../config/passport';
import { UserDTO } from '../dtos/UserDTO';

export interface IAuthController {
  authenticate(): void;
  callback(res: Response): Promise<void>;
  getProfile(req: Request): UserDTO;
  logout(req: Request, res: Response): void;
}

@controller('/auth')
export class AuthController implements IAuthController {
  @httpGet('/profile', isAuthenticated)
  public getProfile(
    @request() req: Request,
  ): UserDTO {
    return req.user as UserDTO;
  }

  @httpGet('/github', passport.authenticate('github'))
  // tslint:disable-next-line:no-empty
  public authenticate(): void { }

  @httpGet('/github/callback', passport.authenticate('github', { failureRedirect: '/' }))
  public async callback(
    @response() res: Response,
  ): Promise<void> {
    res.redirect(Configuration.REDIRECT_URL);
  }

  @httpPost('/logout')
  public logout(
    @request() req: Request,
    @response() res: Response,
  ) {
    req.logout();
    res.send('Successfully logged out');
  }
}
