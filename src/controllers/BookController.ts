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
  BookDTO,
  BookUpdateDTO,
  IBookUpdateDTO,
  INewBookDTO,
  IPageableCollectionDTO,
  NewBookDTO,
} from '../dtos';
import { ValidationError } from '../errors/ValidationError';
import { BookService } from '../services/BookService';
import {
  errorHandler,
  PageableCollectionBuilder,
} from '../util';

export interface IBookController {
  // tslint:disable-next-line:max-line-length
  getBooks(offset: number, pageSize: number, query: string, req: Request, res: Response): Promise<IPageableCollectionDTO<BookDTO> | undefined>;
  getBook(id: number, req: Request, res: Response): Promise<BookDTO | undefined>;
  createBook(newBook: INewBookDTO, req: Request, res: Response): Promise<void>;
  updateBook(id: number, bookUpdate: IBookUpdateDTO, req: Request, res: Response): Promise<BookDTO | undefined>;
  deleteBook(id: number, res: Response): Promise<void>;
}

@controller('/books')
export class BookController implements IBookController {
  constructor(
    @inject(Types.BookService)
    private readonly bookService: BookService,
  ) { }

  @httpGet('/')
  public async getBooks(
    @queryParam('offset') offset: number = 0,
    @queryParam('page-size') pageSize: number = 10,
    @queryParam('q') query: string,
    @request() req: Request,
    @response() res: Response,
  ): Promise<IPageableCollectionDTO<BookDTO> | undefined> {
    const validationResult = Joi.validate(req.query, Schemas.GetBooksQuery);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const [books, total] = await this.bookService.getBooks(offset, pageSize, query);
      return new PageableCollectionBuilder(
        books.map((book) => BookDTO.toDTO(book, req)),
        req,
        Number(offset),
        Number(pageSize),
        total,
      ).build();
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpGet('/:id')
  public async getBook(
    @requestParam('id') id: number,
    @request() req: Request,
    @response() res: Response,
  ): Promise<BookDTO | undefined> {
    const validationResult = Joi.validate(id, Schemas.Id);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const book = await this.bookService.getBook(id);
      return BookDTO.toDTO(book, req);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPost('/', isAuthenticated)
  public async createBook(
    @requestBody() newBook: INewBookDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const validationResult = Joi.validate(newBook, Schemas.NewBook);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const createdBook = await this.bookService.createBook(new NewBookDTO(newBook));
      res.location(`${req.originalUrl}/${createdBook.id}`);
      res.sendStatus(CREATED);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPatch('/:id', isAuthenticated)
  public async updateBook(
    @requestParam('id') id: number,
    @requestBody() bookUpdate: IBookUpdateDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<BookDTO | undefined> {
    const validationResultId = Joi.validate(id, Schemas.Id);
    const validationResultBookUpdate = Joi.validate(bookUpdate, Schemas.BookUpdate);
    try {
      if (validationResultId.error) {
        throw new ValidationError(validationResultId.error.message);
      } else if (validationResultBookUpdate.error) {
        throw new ValidationError(validationResultBookUpdate.error.message);
      }
      const updatedBook = await this.bookService.updateBook(id, new BookUpdateDTO(validationResultBookUpdate.value));
      return BookDTO.toDTO(updatedBook, req);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpDelete('/:id', isAuthenticated)
  public async deleteBook(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    const validationResult = Joi.validate(id, Schemas.Id);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      return await this.bookService.deleteBook(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
