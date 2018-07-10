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
  queryParam,
  request,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';
import Joi from 'joi';

import { isAuthenticated } from '../config/passport';
import {
  Schemas,
  Types,
} from '../constants';
import {
  CategoryDTO,
  CategoryUpdateDTO,
  ICategoryUpdateDTO,
} from '../dtos';
import { ValidationError } from '../errors/ValidationError';
import { CategoryService } from '../services/CategoryService';
import { errorHandler } from '../util/errorHandler';

export interface ICategoryController {
  getCategories(query: string, req: Request, res: Response): Promise<CategoryDTO[] | undefined>;
  getCategory(id: number, req: Request, res: Response): Promise<CategoryDTO | undefined>;
  createCategory(newCategory: ICategoryUpdateDTO, req: Request, res: Response): Promise<void>;
  // tslint:disable-next-line:max-line-length
  updateCategory(id: number, categoryUpdate: ICategoryUpdateDTO, req: Request, res: Response): Promise<CategoryDTO | undefined>;
  deleteCategory(id: number, res: Response): Promise<void>;
}

@controller('/categories')
export class CategoryController implements ICategoryController {
  constructor(
    @inject(Types.CategoryService)
    private readonly categoryService: CategoryService,
  ) { }

  @httpGet('/')
  public async getCategories(
    @queryParam('q') query: string,
    @request() req: Request,
    @response() res: Response,
  ): Promise<CategoryDTO[] | undefined> {
    const validationResult = Joi.validate(req.query, Schemas.GetCategoriesQuery);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const categories = await this.categoryService.getCategories(query);
      return categories.map((category) => CategoryDTO.toDTO(category, req));
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpGet('/:id')
  public async getCategory(
    @requestParam('id') id: number,
    @request() req: Request,
    @response() res: Response,
  ): Promise<CategoryDTO | undefined> {
    const validationResult = Joi.validate(id, Schemas.Id);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const category = await this.categoryService.getCategory(id);
      return CategoryDTO.toDTO(category, req);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPost('/', isAuthenticated)
  public async createCategory(
    @requestBody() newCategory: ICategoryUpdateDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const validationResult = Joi.validate(newCategory, Schemas.Category);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const createdCategory = await this.categoryService.createCategory(new CategoryUpdateDTO(newCategory));
      res.location(`${req.originalUrl}/${createdCategory.id}`);
      res.sendStatus(CREATED);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPut('/:id', isAuthenticated)
  public async updateCategory(
    @requestParam('id') id: number,
    @requestBody() categoryUpdate: ICategoryUpdateDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<CategoryDTO | undefined> {
    const validationResultId = Joi.validate(id, Schemas.Id);
    const validationResultCategoryUpdate = Joi.validate(categoryUpdate, Schemas.Category);
    try {
      if (validationResultId.error) {
        throw new ValidationError(validationResultId.error.message);
      } else if (validationResultCategoryUpdate.error) {
        throw new ValidationError(validationResultCategoryUpdate.error.message);
      }
      const updatedCategory = await this.categoryService.updateCategory(id, new CategoryUpdateDTO(categoryUpdate));
      return CategoryDTO.toDTO(updatedCategory, req);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpDelete('/:id', isAuthenticated)
  public async deleteCategory(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    const validationResult = Joi.validate(id, Schemas.Id);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      return await this.categoryService.deleteCategory(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
