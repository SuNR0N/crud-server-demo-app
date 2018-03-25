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
  BookDTO,
  NewBookDTO,
} from '../dtos';
import { BookService } from '../services/BookService';

export interface IBookController {
  getBooks(): Promise<BookDTO[]>;
  getBook(id: number, res: Response): Promise<BookDTO | undefined>;
  createBook(newBook: NewBookDTO): Promise<BookDTO>;
  updateBook(updatedBook: Partial<BookDTO>, id: number): Promise<BookDTO | undefined>;
  deleteBook(id: number): Promise<void>;
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
    const book = await this.bookService.getBook(id);
    if (book) {
      return BookDTO.toDTO(book);
    } else {
      res.status(404);
      res.send('Not Found');
    }
  }

  @httpPost('/')
  public async createBook(
    @requestBody() newBook: NewBookDTO,
  ): Promise<BookDTO> {
    const book = await this.bookService.createBook(newBook);
    return BookDTO.toDTO(book);
  }

  @httpPatch('/:id')
  public async updateBook(
    @requestBody() updatedBook: Partial<BookDTO>,
    @requestParam('id') id: number,
  ): Promise<BookDTO | undefined> {
    const book = await this.bookService.updateBook(id, updatedBook);
    return BookDTO.toDTO(book);
  }

  @httpDelete('/:id')
  public async deleteBook(
    @requestParam('id') id: number,
  ): Promise<void> {
    return await this.bookService.deleteBook(id);
  }
}
