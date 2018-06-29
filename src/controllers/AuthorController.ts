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
  httpPatch,
  httpPost,
  request,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';
import Joi from 'joi';

import { TYPES } from '../constants/types';
import {
  AuthorDTO,
  AuthorUpdateDTO,
  IAuthorUpdateDTO,
  INewAuthorDTO,
  NewAuthorDTO,
} from '../dtos';
import { ValidationError } from '../errors';
import { AuthorService } from '../services/AuthorService';
import { errorHandler } from '../util/errorHandler';

export interface IAuthorController {
  getAuthors(): Promise<AuthorDTO[]>;
  getAuthor(id: number, res: Response): Promise<AuthorDTO | undefined>;
  createAuthor(newAuthor: INewAuthorDTO, req: Request, res: Response): Promise<void>;
  updateAuthor(id: number, authorUpdate: IAuthorUpdateDTO, res: Response): Promise<AuthorDTO | undefined>;
  deleteAuthor(id: number, res: Response): Promise<void>;
}

@controller('/authors')
export class AuthorController implements IAuthorController {
  constructor(
    @inject(TYPES.AuthorService)
    private readonly authorService: AuthorService,
  ) { }

  @httpGet('/')
  public async getAuthors(): Promise<AuthorDTO[]> {
    const authors = await this.authorService.getAuthors();
    return authors.map(AuthorDTO.toDTO);
  }

  @httpGet('/:id')
  public async getAuthor(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<AuthorDTO | undefined> {
    const idSchema = Joi.number().label('id');
    const result = Joi.validate(id as any, idSchema);
    try {
      if (result.error) {
        throw new ValidationError(result.error.message);
      }
      const author = await this.authorService.getAuthor(id);
      return AuthorDTO.toDTO(author);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPost('/')
  public async createAuthor(
    @requestBody() newAuthor: INewAuthorDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const newAuthorSchema = {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      middleName: Joi.string(),
    };
    const result = Joi.validate(newAuthor, newAuthorSchema);
    try {
      if (result.error) {
        throw new ValidationError(result.error.message);
      }
      const createdAuthor = await this.authorService.createAuthor(new NewAuthorDTO(newAuthor));
      res.location(`${req.originalUrl}/${createdAuthor.id}`);
      res.sendStatus(CREATED);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPatch('/:id')
  public async updateAuthor(
    @requestParam('id') id: number,
    @requestBody() authorUpdate: IAuthorUpdateDTO,
    @response() res: Response,
  ): Promise<AuthorDTO | undefined> {
    const idSchema = Joi.number().label('id');
    const authorUpdateSchema = {
      firstName: Joi.string(),
      lastName: Joi.string(),
      middleName: Joi.string(),
    };
    const resultId = Joi.validate(id, idSchema);
    const resultAuthUpdate = Joi.validate(authorUpdate, authorUpdateSchema);
    try {
      if (resultId.error) {
        throw new ValidationError(resultId.error.message);
      } else if (resultAuthUpdate.error) {
        throw new ValidationError(resultAuthUpdate.error.message);
      }
      const updatedAuthor = await this.authorService.updateAuthor(id, new AuthorUpdateDTO(authorUpdate));
      return AuthorDTO.toDTO(updatedAuthor);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpDelete('/:id')
  public async deleteAuthor(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    const idSchema = Joi.number().label('id');
    const result = Joi.validate(id, idSchema);
    try {
      if (result.error) {
        throw new ValidationError(result.error.message);
      }
      return await this.authorService.deleteAuthor(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
