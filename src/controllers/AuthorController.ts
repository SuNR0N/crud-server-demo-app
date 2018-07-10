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
  AuthorDTO,
  AuthorUpdateDTO,
  IAuthorUpdateDTO,
  INewAuthorDTO,
  NewAuthorDTO,
} from '../dtos';
import { ValidationError } from '../errors/ValidationError';
import { AuthorService } from '../services/AuthorService';
import { errorHandler } from '../util/errorHandler';

export interface IAuthorController {
  getAuthors(query: string, req: Request, res: Response): Promise<AuthorDTO[] | undefined>;
  getAuthor(id: number, req: Request, res: Response): Promise<AuthorDTO | undefined>;
  createAuthor(newAuthor: INewAuthorDTO, req: Request, res: Response): Promise<void>;
  updateAuthor(id: number, authorUpdate: IAuthorUpdateDTO, req: Request, res: Response): Promise<AuthorDTO | undefined>;
  deleteAuthor(id: number, res: Response): Promise<void>;
}

@controller('/authors')
export class AuthorController implements IAuthorController {
  constructor(
    @inject(Types.AuthorService)
    private readonly authorService: AuthorService,
  ) { }

  @httpGet('/')
  public async getAuthors(
    @queryParam('q') query: string,
    @request() req: Request,
    @response() res: Response,
  ): Promise<AuthorDTO[] | undefined> {
    const validationResult = Joi.validate(req.query, Schemas.GetAuthorsQuery);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const authors = await this.authorService.getAuthors(query);
      return authors.map((author) => AuthorDTO.toDTO(author, req));
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpGet('/:id')
  public async getAuthor(
    @requestParam('id') id: number,
    @request() req: Request,
    @response() res: Response,
  ): Promise<AuthorDTO | undefined> {
    const validationResult = Joi.validate(id, Schemas.Id);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const author = await this.authorService.getAuthor(id);
      return AuthorDTO.toDTO(author, req);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPost('/', isAuthenticated)
  public async createAuthor(
    @requestBody() newAuthor: INewAuthorDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const validationResult = Joi.validate(newAuthor, Schemas.NewAuthor);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const createdAuthor = await this.authorService.createAuthor(new NewAuthorDTO(newAuthor));
      res.location(`${req.originalUrl}/${createdAuthor.id}`);
      res.sendStatus(CREATED);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPatch('/:id', isAuthenticated)
  public async updateAuthor(
    @requestParam('id') id: number,
    @requestBody() authorUpdate: IAuthorUpdateDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<AuthorDTO | undefined> {
    const validationResultId = Joi.validate(id, Schemas.Id);
    const validationResultAuthorUpdate = Joi.validate(authorUpdate, Schemas.AuthorUpdate);
    try {
      if (validationResultId.error) {
        throw new ValidationError(validationResultId.error.message);
      } else if (validationResultAuthorUpdate.error) {
        throw new ValidationError(validationResultAuthorUpdate.error.message);
      }
      const updatedAuthor = await this.authorService.updateAuthor(id, new AuthorUpdateDTO(authorUpdate));
      return AuthorDTO.toDTO(updatedAuthor, req);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpDelete('/:id', isAuthenticated)
  public async deleteAuthor(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    const validationResult = Joi.validate(id, Schemas.Id);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      return await this.authorService.deleteAuthor(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
