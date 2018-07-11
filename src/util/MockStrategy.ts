import {
  Profile,
  Strategy,
} from 'passport';

type Done = (err: any, user?: any) => void;
type VerifyCallback = (accessToken: string | null, refreshToken: string | null, profile: Profile, done: Done) => void;

export class MockStrategy extends Strategy {
  private _user: Profile;
  private _cb: VerifyCallback;

  constructor(
    public name: string,
    verify: VerifyCallback,
  ) {
    super();
    this._cb = verify;
    this._user = {
      displayName: 'John Doe',
      emails: [
        { value: 'john.doe@dummy.com' },
      ],
      id: '12345',
      name: {
        familyName: 'Doe',
        givenName: 'John',
      },
      photos: [
        { value: 'https://avatars1.githubusercontent.com/u/4305472?v=4' },
      ],
      provider: this.name,
      username: 'J0hn_D03',
    };
  }

  public authenticate() {
    this._cb(null, null, this._user, (_error, user) => {
      this.success(user);
    });
  }
}
