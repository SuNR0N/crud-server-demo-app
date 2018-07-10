import {
  getConnection,
  Repository,
} from 'typeorm';

import { User } from '../entities/User';

export function getUserRepository(): Repository<User> {
  const conn = getConnection();
  const userRepository = conn.getRepository(User);
  return userRepository;
}
