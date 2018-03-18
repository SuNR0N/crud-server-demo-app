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

import { TYPES } from '../constant/types';
import { IBook } from '../interfaces/Book';
import { BookService } from '../service/BookService';

@controller('/books')
export class BookController {
  constructor(
    @inject(TYPES.BookService)
    private readonly bookService: BookService,
  ) { }

  @httpGet('/')
  public getBooks(): IBook[] {
    return this.bookService.getBooks();
  }

  @httpGet('/:id')
  public getBook(
    @requestParam('id') id: string,
    @response() res: Response,
  ): IBook | void {
    try {
      return this.bookService.getBook(id);
    } catch (e) {
      res.status(404);
      res.send(e.message);
    }
  }

  @httpPost('/')
  public createBook(
    @requestBody() newBook: IBook,
  ): IBook {
    return this.bookService.createBook(newBook);
  }

  @httpPatch('/:id')
  public updateBook(
    @requestBody() updatedBook: Partial<IBook>,
    @requestParam('id') id: string,
    @response() res: Response,
  ): IBook | void {
    try {
      return this.bookService.updateBook(id, updatedBook);
    } catch (e) {
      res.status(404);
      res.send(e.message);
    }
  }

  @httpDelete('/:id')
  public deleteBook(
    @requestParam('id') id: string,
  ): void {
    return this.bookService.deleteBook(id);
  }
}
