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
  BookDTO,
  BookUpdateDTO,
  IBookUpdateDTO,
  INewBookDTO,
  NewBookDTO,
} from '../dtos';
import { BookService } from '../services/BookService';
import { errorHandler } from '../util/errorHandler';

export interface IBookController {
  getBooks(): Promise<BookDTO[]>;
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
  public async getBooks(): Promise<BookDTO[]> {
    const books = await this.bookService.getBooks();
    return books.map(BookDTO.toDTO);
  }

  @httpGet('/:id')
  public async getBook(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<BookDTO | undefined> {
    try {
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
    const createdBook = await this.bookService.createBook(new NewBookDTO(newBook));
    res.location(`${req.originalUrl}/${createdBook.id}`);
    res.sendStatus(CREATED);
  }

  @httpPatch('/:id')
  public async updateBook(
    @requestParam('id') id: number,
    @requestBody() bookUpdate: IBookUpdateDTO,
    @response() res: Response,
  ): Promise<BookDTO | undefined> {
    try {
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
    try {
      return await this.bookService.deleteBook(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
