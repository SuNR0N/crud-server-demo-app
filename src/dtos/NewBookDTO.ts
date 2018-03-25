export interface INewBookDTO {
  title: string;
  isbn13: string;
}

export class NewBookDTO implements INewBookDTO {
  private _isbn13: string;
  private _title: string;

  constructor(data: any = {}) {
    this._isbn13 = data.isbn13;
    this._title = data.title;
  }

  public get isbn13(): string {
    return this._isbn13;
  }

  public get title(): string {
    return this._title;
  }
}
