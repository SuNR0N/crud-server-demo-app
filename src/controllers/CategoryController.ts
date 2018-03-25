import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';

import { TYPES } from '../constants/types';
import {
  CategoryDTO,
  CategoryUpdateDTO,
} from '../dtos';
import { CategoryService } from '../services/CategoryService';

export interface ICategoryController {
  getCategories(): Promise<CategoryDTO[]>;
  getCategory(id: number, res: Response): Promise<CategoryDTO | undefined>;
  createCategory(newCategory: CategoryUpdateDTO): Promise<CategoryDTO>;
  updateCategory(id: number, categoryUpdate: CategoryUpdateDTO): Promise<CategoryDTO | undefined>;
  deleteCategory(id: number): Promise<void>;
}

@controller('/categories')
export class CategoryController implements ICategoryController {
  constructor(
    @inject(TYPES.CategoryService)
    private readonly categoryService: CategoryService,
  ) { }

  @httpGet('/')
  public async getCategories(): Promise<CategoryDTO[]> {
    const categories = await this.categoryService.getCategories();
    return categories.map(CategoryDTO.toDTO);
  }

  @httpGet('/:id')
  public async getCategory(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<CategoryDTO | undefined> {
    const category = await this.categoryService.getCategory(id);
    if (category) {
      return CategoryDTO.toDTO(category);
    } else {
      res.status(404);
      res.send('Not Found');
    }
  }

  @httpPost('/')
  public async createCategory(
    @requestBody() newCategory: CategoryUpdateDTO,
  ): Promise<CategoryDTO> {
    const createdCategory = await this.categoryService.createCategory(newCategory);
    return CategoryDTO.toDTO(createdCategory);
  }

  @httpPut('/:id')
  public async updateCategory(
    @requestParam('id') id: number,
    @requestBody() categoryUpdate: CategoryUpdateDTO,
  ): Promise<CategoryDTO | undefined> {
    const updatedCategory = await this.categoryService.updateCategory(id, categoryUpdate);
    return CategoryDTO.toDTO(updatedCategory);
  }

  @httpDelete('/:id')
  public async deleteCategory(
    @requestParam('id') id: number,
  ): Promise<void> {
    return await this.categoryService.deleteCategory(id);
  }
}
