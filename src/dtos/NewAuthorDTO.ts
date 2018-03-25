export interface INewAuthorDTO {
  firstName: string;
  lastName: string;
  middleName?: string;
}

export class NewAuthorDTO implements INewAuthorDTO {
  public firstName!: string;
  public lastName!: string;
  public middleName?: string;
}
