import {
  getConnection,
  Repository,
} from 'typeorm';

import { Category } from '../entities/Category';

export function getCategoryRepository(): Repository<Category> {
  const conn = getConnection();
  const categoryRepository = conn.getRepository(Category);
  return categoryRepository;
}
