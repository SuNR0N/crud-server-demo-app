import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { Types } from '../constants/types';
import { UserDTO } from '../dtos/UserDTO';
import { User } from '../entities/User';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';

export interface IUserService {
  createUser(user: UserDTO): Promise<User>;
  getUser(id: number): Promise<User>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Types.UserRepository)
    private readonly userRepository: Repository<User>,
  ) { }

  public createUser(user: UserDTO): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  public async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new EntityNotFoundError(User, id);
    }
    return user;
  }
}
