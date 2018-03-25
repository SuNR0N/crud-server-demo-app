export interface INewBookDTO {
  isbn10?: string;
  isbn13: string;
  publicationDate?: string;
  title: string;
}

export class NewBookDTO implements INewBookDTO {
  public isbn10?: string;
  public isbn13!: string;
  public publicationDate?: string;
  public title!: string;
}
