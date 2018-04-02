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
  BookDTO,
  BookUpdateDTO,
  IBookUpdateDTO,
  INewBookDTO,
  NewBookDTO,
} from '../dtos';
import { EntityNotFoundError } from '../errors';
import { BookService } from '../services/BookService';

export interface IBookController {
  getBooks(): Promise<BookDTO[]>;
  getBook(id: number, res: Response): Promise<BookDTO | undefined>;
  createBook(newBook: INewBookDTO): Promise<BookDTO>;
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
  public async createBook(
    @requestBody() newBook: INewBookDTO,
  ): Promise<BookDTO> {
    const createdBook = await this.bookService.createBook(new NewBookDTO(newBook));
    return BookDTO.toDTO(createdBook);
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
  public async deleteBook(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    try {
      return await this.bookService.deleteBook(id);
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
