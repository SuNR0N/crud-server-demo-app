import { Profile } from 'passport';

export interface IUserDTO {
  avatarUrl?: string;
  email: string;
  id: number;
  name?: string;
  username: string;
}

export class UserDTO implements IUserDTO {
  public avatarUrl?: string;
  public email: string;
  public id: number;
  public name?: string;
  public username: string;

  constructor(profile: Profile) {
    this.avatarUrl = profile.photos![0].value;
    this.email = profile.emails![0].value;
    this.id = parseInt(profile.id, 10);
    this.name = profile.displayName;
    this.username = profile.username!;
  }
}
