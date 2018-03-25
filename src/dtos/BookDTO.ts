import { Book } from '../entities/Book';

export interface IBookDTO {
  authors: string[];
  categories: string[];
  id: number | null;
  isbn10: string | null;
  isbn13: string | null;
  publicationDate: string | null;
  publishers: string[];
}

export class BookDTO implements IBookDTO {
  public static toDTO(entity: Book): BookDTO {
    const data: IBookDTO = {
      authors: entity.authors.map((author) => {
        const name: string[] = [];
        name.push(author.first_name);
        if (author.middle_name) {
          name.push(author.middle_name);
        }
        name.push(author.last_name);
        return name.join(' ');
      }),
      categories: entity.categories.map((category) => category.name),
      id: entity.id,
      isbn10: entity.isbn10,
      isbn13: entity.isbn13,
      publicationDate: entity.publicationDate,
      publishers: entity.publishers.map((publisher) => publisher.name),
    };
    return new BookDTO(data);
  }

  public authors: string[];
  public categories: string[];
  public id: number | null;
  public isbn10: string | null;
  public isbn13: string | null;
  public publicationDate: string | null;
  public publishers: string[];

  constructor(data: IBookDTO = {
    authors: [],
    categories: [],
    id: null,
    isbn10: null,
    isbn13: null,
    publicationDate: null,
    publishers: [],
  }) {
    this.authors = data.authors;
    this.categories = data.categories;
    this.id = data.id;
    this.isbn10 = data.isbn10;
    this.isbn13 = data.isbn13;
    this.publicationDate = data.publicationDate;
    this.publishers = data.publishers;
  }
}
