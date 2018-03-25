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
}
