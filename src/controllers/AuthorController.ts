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

import { TYPES } from '../constants/types';
import {
  AuthorDTO,
  AuthorUpdateDTO,
  IAuthorUpdateDTO,
  INewAuthorDTO,
  NewAuthorDTO,
} from '../dtos';
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
    try {
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
    const createdAuthor = await this.authorService.createAuthor(new NewAuthorDTO(newAuthor));
    res.location(`${req.originalUrl}/${createdAuthor.id}`);
    res.sendStatus(CREATED);
  }

  @httpPatch('/:id')
  public async updateAuthor(
    @requestParam('id') id: number,
    @requestBody() authorUpdate: IAuthorUpdateDTO,
    @response() res: Response,
  ): Promise<AuthorDTO | undefined> {
    try {
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
    try {
      return await this.authorService.deleteAuthor(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
