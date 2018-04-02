import { Response } from 'express';
import {
  getStatusText,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from 'http-status-codes';
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
  ICategoryUpdateDTO,
} from '../dtos';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { CategoryService } from '../services/CategoryService';

export interface ICategoryController {
  getCategories(): Promise<CategoryDTO[]>;
  getCategory(id: number, res: Response): Promise<CategoryDTO | undefined>;
  createCategory(newCategory: ICategoryUpdateDTO): Promise<CategoryDTO>;
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
      if (error instanceof EntityNotFoundError) {
        res.status(NOT_FOUND);
        res.send(error.message);
      } else {
        res.status(INTERNAL_SERVER_ERROR);
        res.send(getStatusText(INTERNAL_SERVER_ERROR));
      }
    }
  }

  @httpPost('/')
  public async createCategory(
    @requestBody() newCategory: ICategoryUpdateDTO,
  ): Promise<CategoryDTO> {
    const createdCategory = await this.categoryService.createCategory(new CategoryUpdateDTO(newCategory));
    return CategoryDTO.toDTO(createdCategory);
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
      if (error instanceof EntityNotFoundError) {
        res.status(NOT_FOUND);
        res.send(error.message);
      } else {
        res.status(INTERNAL_SERVER_ERROR);
        res.send(getStatusText(INTERNAL_SERVER_ERROR));
      }
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
      if (error instanceof EntityNotFoundError) {
        res.status(NOT_FOUND);
        res.send(error.message);
      } else {
        res.status(INTERNAL_SERVER_ERROR);
        res.send(getStatusText(INTERNAL_SERVER_ERROR));
      }
    }
  }
}
