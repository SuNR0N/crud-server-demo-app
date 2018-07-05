import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { Types } from '../constants/types';
import { CategoryUpdateDTO } from '../dtos/CategoryUpdateDTO';
import { Category } from '../entities/Category';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';

export interface ICategoryService {
  createCategory(category: CategoryUpdateDTO): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  getCategory(id: number): Promise<Category>;
  getCategories(query: string): Promise<Category[]>;
  updateCategory(id: number, category: CategoryUpdateDTO): Promise<Category>;
}

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(Types.CategoryRepository)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public createCategory(category: CategoryUpdateDTO): Promise<Category> {
    const newCategory = this.categoryRepository.create(category.toEntity());
    return this.categoryRepository.save(newCategory);
  }

  public async deleteCategory(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new EntityNotFoundError(Category, id);
    }
    await this.categoryRepository.delete(id);
  }

  public async getCategory(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new EntityNotFoundError(Category, id);
    }
    return category;
  }

  public async getCategories(query: string = ''): Promise<Category[]> {
    const paramLike = { query: `%${query.toLowerCase()}%` };
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) LIKE :query', paramLike)
      .getMany();
  }

  public async updateCategory(id: number, category: CategoryUpdateDTO): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne(id);
    if (!existingCategory) {
      throw new EntityNotFoundError(Category, id);
    }
    const updatedCategory: Category = {
      ...existingCategory,
      ...category.toEntity(),
    };
    return this.categoryRepository.save(updatedCategory);
  }
}
