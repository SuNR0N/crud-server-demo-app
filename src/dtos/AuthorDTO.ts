import { Author } from '../entities/Author';

export interface IAuthorDTO {
  firstName: string | null;
  fullName: string | null;
  id: number | null;
  lastName: string | null;
  middleName: string | null;
}

export const fullNameMapper = (author: Author): string => {
  const name: string[] = [];
  name.push(author.first_name);
  if (author.middle_name) {
    name.push(author.middle_name);
  }
  name.push(author.last_name);
  return name.join(' ');
};

export class AuthorDTO implements IAuthorDTO {
  public static toDTO(entity: Author): AuthorDTO {
    const data: IAuthorDTO = {
      firstName: entity.first_name,
      fullName: fullNameMapper(entity),
      id: entity.id,
      lastName: entity.last_name,
      middleName: entity.middle_name,
    };
    return new AuthorDTO(data);
  }

  public firstName: string | null;
  public fullName: string | null;
  public id: number | null;
  public lastName: string | null;
  public middleName: string | null;

  constructor(data: IAuthorDTO = {
    firstName: null,
    fullName: null,
    id: null,
    lastName: null,
    middleName: null,
  }) {
    this.firstName = data.firstName;
    this.fullName = data.fullName;
    this.id = data.id;
    this.lastName = data.lastName;
    this.middleName = data.middleName;
  }
}
