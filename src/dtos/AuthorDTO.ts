import { Request } from 'express';

import { Configuration } from '../config';
import { Author } from '../entities/Author';
import { ResourceBuilder } from '../util/ResourceBuilder';
import { IResourceDTO } from './ResourceDTO';

export interface IAuthorDTO extends IResourceDTO {
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
  public static toDTO(entity: Author, req: Request): AuthorDTO {
    const data: IAuthorDTO = {
      firstName: entity.first_name,
      fullName: fullNameMapper(entity),
      id: entity.id,
      lastName: entity.last_name,
      middleName: entity.middle_name,
    };
    const builder = new ResourceBuilder<IAuthorDTO>(AuthorDTO, data)
      .addLink('self', `${Configuration.ROOT_PATH}/authors/${data.id}`);

    if (req.isAuthenticated()) {
      builder
        .addLink('delete', `${Configuration.ROOT_PATH}/authors/${data.id}`, 'DELETE')
        .addLink('update', `${Configuration.ROOT_PATH}/authors/${data.id}`, 'PATCH');
    }

    return builder.build();
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
