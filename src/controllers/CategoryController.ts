import {
  Request,
  Response,
} from 'express';
import { CREATED } from 'http-status-codes';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';

import { TYPES } from '../constants/types';
import {
  CategoryDTO,
  CategoryUpdateDTO,
  ICategoryUpdateDTO,
} from '../dtos';
import { CategoryService } from '../services/CategoryService';
import { errorHandler } from '../util/errorHandler';

export interface ICategoryController {
  getCategories(): Promise<CategoryDTO[]>;
  getCategory(id: number, res: Response): Promise<CategoryDTO | undefined>;
  createCategory(newCategory: ICategoryUpdateDTO, req: Request, res: Response): Promise<void>;
  updateCategory(id: number, categoryUpdate: ICategoryUpdateDTO, res: Response): Promise<CategoryDTO | undefined>;
  deleteCategory(id: number, res: Response): Promise<void>;
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
    try {
      const category = await this.categoryService.getCategory(id);
      return CategoryDTO.toDTO(category);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPost('/')
  public async createCategory(
    @requestBody() newCategory: ICategoryUpdateDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const createdCategory = await this.categoryService.createCategory(new CategoryUpdateDTO(newCategory));
    res.location(`${req.originalUrl}/${createdCategory.id}`);
    res.sendStatus(CREATED);
  }

  @httpPut('/:id')
  public async updateCategory(
    @requestParam('id') id: number,
    @requestBody() categoryUpdate: ICategoryUpdateDTO,
    @response() res: Response,
  ): Promise<CategoryDTO | undefined> {
    try {
      const updatedCategory = await this.categoryService.updateCategory(id, new CategoryUpdateDTO(categoryUpdate));
      return CategoryDTO.toDTO(updatedCategory);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpDelete('/:id')
  public async deleteCategory(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    try {
      return await this.categoryService.deleteCategory(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
