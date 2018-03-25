import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { TYPES } from '../constants/types';
import { CategoryUpdateDTO } from '../dtos/CategoryUpdateDTO';
import { Category } from '../entities/Category';

export interface ICategoryService {
  createCategory(category: CategoryUpdateDTO): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  updateCategory(id: number, category: CategoryUpdateDTO): Promise<Category>;
}

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(TYPES.CategoryRepository)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public createCategory(category: CategoryUpdateDTO): Promise<Category> {
    const newCategory = this.categoryRepository.create(category);
    return this.categoryRepository.save(newCategory);
  }

  public deleteCategory(id: number): Promise<void> {
    return this.categoryRepository.deleteById(id);
  }

  public getCategory(id: number): Promise<Category | undefined> {
    return this.categoryRepository.findOneById(id);
  }

  public getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  public async updateCategory(id: number, category: CategoryUpdateDTO): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOneById(id);
    return this.categoryRepository.save(existingCategory!);
  }
}
