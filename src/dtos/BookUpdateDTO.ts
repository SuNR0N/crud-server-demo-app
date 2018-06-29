import {
  Author,
  Book,
  Category,
  Publisher,
} from '../entities';

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

  public toEntity = (): Partial<Book> => {
    const book: Partial<Book> = {};
    if (Array.isArray(this.authors)) {
      book.authors = this.authors.map((authorId) => {
        const author = new Author();
        author.id = authorId;
        return author;
      });
    }
    if (Array.isArray(this.categories)) {
      book.categories = this.categories.map((categoryId) => {
        const category = new Category();
        category.id = categoryId;
        return category;
      });
    }
    if (this.isbn10) {
      book.isbn10 = this.isbn10;
    }
    if (this.isbn13) {
      book.isbn13 = this.isbn13;
    }
    if (this.publicationDate) {
      book.publicationDate = this.publicationDate;
    }
    if (Array.isArray(this.publishers)) {
      book.publishers = this.publishers.map((publisherId) => {
        const publisher = new Publisher();
        publisher.id = publisherId;
        return publisher;
      });
    }
    if (this.title) {
      book.title = this.title;
    }
    return book;
  }
}
