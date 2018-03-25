export interface IAuthorUpdateDTO {
  firstName?: string;
  lastName?: string;
  middleName?: string;
}

export class AuthorUpdateDTO implements IAuthorUpdateDTO {
  public firstName?: string;
  public lastName?: string;
  public middleName?: string;
}
