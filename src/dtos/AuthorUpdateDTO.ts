import { Author } from '../entities/Author';
import { Utils } from '../util/Utils';

export interface IAuthorUpdateDTO {
  firstName?: string;
  lastName?: string;
  middleName?: string;
}

export class AuthorUpdateDTO implements IAuthorUpdateDTO {
  public firstName?: string;
  public lastName?: string;
  public middleName?: string;

  constructor(data: IAuthorUpdateDTO) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.middleName = data.middleName;
  }

  public toEntity = (): Partial<Author> => Utils.cleanObject({
    first_name: this.firstName,
    last_name: this.lastName,
    middle_name: this.middleName,
  })
}
