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

import { TYPES } from '../constants/types';
import {
  BookDTO,
  BookUpdateDTO,
  IBookUpdateDTO,
  INewBookDTO,
  NewBookDTO,
} from '../dtos';
import { ValidationError } from '../errors/ValidationError';
import { BookService } from '../services/BookService';
import { errorHandler } from '../util/errorHandler';

export interface IBookController {
  getBooks(offset: number, pageSize: number, q: string): Promise<BookDTO[]>;
  getBook(id: number, res: Response): Promise<BookDTO | undefined>;
  createBook(newBook: INewBookDTO, req: Request, res: Response): Promise<void>;
  updateBook(id: number, bookUpdate: IBookUpdateDTO, res: Response): Promise<BookDTO | undefined>;
  deleteBook(id: number, res: Response): Promise<void>;
}

@controller('/books')
export class BookController implements IBookController {
  constructor(
    @inject(TYPES.BookService)
    private readonly bookService: BookService,
  ) { }

  @httpGet('/')
  public async getBooks(
    @queryParam('offset') offset: number = 0,
    @queryParam('page-size') pageSize: number = 10,
    @queryParam('q') q: string,
  ): Promise<BookDTO[]> {
    const [books] = await this.bookService.getBooks(offset, pageSize, q);
    return books.map(BookDTO.toDTO);
  }

  @httpGet('/:id')
  public async getBook(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<BookDTO | undefined> {
    const idSchema = Joi.number().label('id');
    const result = Joi.validate(id, idSchema);
    try {
      if (result.error) {
        throw new ValidationError(result.error.message);
      }
      const book = await this.bookService.getBook(id);
      return BookDTO.toDTO(book);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPost('/')
  public async createBook(
    @requestBody() newBook: INewBookDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const newBookSchema = {
      authors: Joi.array().items(Joi.number()),
      categories: Joi.array().items(Joi.number()),
      isbn10: Joi.string(),
      isbn13: Joi.string().required(),
      publicationDate: Joi.string(),
      publishers: Joi.array().items(Joi.number()),
      title: Joi.string().required(),
    };
    const result = Joi.validate(newBook, newBookSchema);
    try {
      if (result.error) {
        throw new ValidationError(result.error.message);
      }
      const createdBook = await this.bookService.createBook(new NewBookDTO(newBook));
      res.location(`${req.originalUrl}/${createdBook.id}`);
      res.sendStatus(CREATED);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPatch('/:id')
  public async updateBook(
    @requestParam('id') id: number,
    @requestBody() bookUpdate: IBookUpdateDTO,
    @response() res: Response,
  ): Promise<BookDTO | undefined> {
    const idSchema = Joi.number().label('id');
    const bookUpdateSchema = {
      authors: Joi.array().items(Joi.number()),
      categories: Joi.array().items(Joi.number()),
      isbn10: Joi.string(),
      isbn13: Joi.string(),
      publicationDate: Joi.string(),
      publishers: Joi.array().items(Joi.number()),
      title: Joi.string(),
    };
    const resultId = Joi.validate(id, idSchema);
    const resultBookUpdate = Joi.validate(bookUpdate, bookUpdateSchema);
    try {
      if (resultId.error) {
        throw new ValidationError(resultId.error.message);
      } else if (resultBookUpdate.error) {
        throw new ValidationError(resultBookUpdate.error.message);
      }
      const updatedBook = await this.bookService.updateBook(id, new BookUpdateDTO(bookUpdate));
      return BookDTO.toDTO(updatedBook);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpDelete('/:id')
  public async deleteBook(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    const idSchema = Joi.number().label('id');
    const result = Joi.validate(id, idSchema);
    try {
      if (result.error) {
        throw new ValidationError(result.error.message);
      }
      return await this.bookService.deleteBook(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
