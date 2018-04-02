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
  httpPatch,
  httpPost,
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
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { AuthorService } from '../services/AuthorService';

export interface IAuthorController {
  getAuthors(): Promise<AuthorDTO[]>;
  getAuthor(id: number, res: Response): Promise<AuthorDTO | undefined>;
  createAuthor(newAuthor: INewAuthorDTO): Promise<AuthorDTO>;
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
  public async createAuthor(
    @requestBody() newAuthor: INewAuthorDTO,
  ): Promise<AuthorDTO> {
    const createdAuthor = await this.authorService.createAuthor(new NewAuthorDTO(newAuthor));
    return AuthorDTO.toDTO(createdAuthor);
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
  public async deleteAuthor(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    try {
      return await this.authorService.deleteAuthor(id);
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
