import { Response } from 'express';
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
  NewAuthorDTO,
} from '../dtos';
import { AuthorService } from '../services/AuthorService';

export interface IAuthorController {
  getAuthors(): Promise<AuthorDTO[]>;
  getAuthor(id: number, res: Response): Promise<AuthorDTO | undefined>;
  createAuthor(newAuthor: NewAuthorDTO): Promise<AuthorDTO>;
  updateAuthor(id: number, authorUpdate: AuthorUpdateDTO): Promise<AuthorDTO | undefined>;
  deleteAuthor(id: number): Promise<void>;
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
    const author = await this.authorService.getAuthor(id);
    if (author) {
      return AuthorDTO.toDTO(author);
    } else {
      res.status(404);
      res.send('Not Found');
    }
  }

  @httpPost('/')
  public async createAuthor(
    @requestBody() newAuthor: NewAuthorDTO,
  ): Promise<AuthorDTO> {
    const createdAuthor = await this.authorService.createAuthor(newAuthor);
    return AuthorDTO.toDTO(createdAuthor);
  }

  @httpPatch('/:id')
  public async updateAuthor(
    @requestParam('id') id: number,
    @requestBody() authorUpdate: AuthorUpdateDTO,
  ): Promise<AuthorDTO | undefined> {
    const updatedAuthor = await this.authorService.updateAuthor(id, authorUpdate);
    return AuthorDTO.toDTO(updatedAuthor);
  }

  @httpDelete('/:id')
  public async deleteAuthor(
    @requestParam('id') id: number,
  ): Promise<void> {
    return await this.authorService.deleteAuthor(id);
  }
}
