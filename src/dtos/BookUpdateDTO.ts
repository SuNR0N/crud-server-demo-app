import {
  Author,
  Book,
  Category,
  Publisher,
} from '../entities';
import { Utils } from '../util/Utils';

export interface IBookUpdateDTO {
  authors?: number[];
  categories?: number[];
  isbn10?: string;
  isbn13?: string;
  publicationDate?: string;
  publishers?: number[];
  title?: string;
}

export class BookUpdateDTO implements IBookUpdateDTO {
  public authors?: number[];
  public categories?: number[];
  public isbn10?: string;
  public isbn13?: string;
  public publicationDate?: string;
  public publishers?: number[];
  public title?: string;

  constructor(data: IBookUpdateDTO) {
    this.authors = data.authors;
    this.categories = data.categories;
    this.isbn10 = data.isbn10;
    this.isbn13 = data.isbn13;
    this.publicationDate = data.publicationDate;
    this.publishers = data.publishers;
    this.title = data.title;
  }

  public toEntity = (): Partial<Book> => Utils.cleanObject({
    authors: Array.isArray(this.authors) ? this.authors.map((authorId) => {
      const author = new Author();
      author.id = authorId;
      return author;
    }) : undefined,
    categories: Array.isArray(this.categories) ? this.categories.map((categoryId) => {
      const category = new Category();
      category.id = categoryId;
      return category;
    }) : undefined,
    isbn10: this.isbn10,
    isbn13: this.isbn13,
    publicationDate: this.publicationDate,
    publishers: Array.isArray(this.publishers) ? this.publishers.map((publisherId) => {
      const publisher = new Publisher();
      publisher.id = publisherId;
      return publisher;
    }) : undefined,
    title: this.title,
  })
}
