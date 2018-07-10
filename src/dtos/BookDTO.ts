import { Request } from 'express';

import { Configuration } from '../config';
import {
  Book,
  Category,
  Publisher,
} from '../entities';
import { ResourceBuilder } from '../util/ResourceBuilder';
import { fullNameMapper } from './AuthorDTO';
import { IResourceDTO } from './ResourceDTO';

export interface IBookDTO extends IResourceDTO {
  authors: string[];
  categories: string[];
  id: number | null;
  isbn10: string | null;
  isbn13: string | null;
  publicationDate: string | null;
  publishers: string[];
  title: string | null;
}

const categoryMapper = (category: Category): string => {
  return category.name;
};

const publisherMapper = (publisher: Publisher): string => {
  return publisher.name;
};

export class BookDTO implements IBookDTO {
  public static toDTO(entity: Book, req: Request): BookDTO {
    const data: IBookDTO = {
      authors: (entity.authors || []).map(fullNameMapper),
      categories: (entity.categories || []).map(categoryMapper),
      id: entity.id,
      isbn10: entity.isbn10,
      isbn13: entity.isbn13,
      publicationDate: entity.publicationDate,
      publishers: (entity.publishers || []).map(publisherMapper),
      title: entity.title,
    };
    const builder = new ResourceBuilder<IBookDTO>(BookDTO, data)
      .addLink('self', `${Configuration.ROOT_PATH}/books/${data.id}`);

    if (req.isAuthenticated()) {
      builder
        .addLink('delete', `${Configuration.ROOT_PATH}/books/${data.id}`, 'DELETE')
        .addLink('update', `${Configuration.ROOT_PATH}/books/${data.id}`, 'PATCH');
    }

    return builder.build();
  }

  public authors: string[];
  public categories: string[];
  public id: number | null;
  public isbn10: string | null;
  public isbn13: string | null;
  public publicationDate: string | null;
  public publishers: string[];
  public title: string | null;

  constructor(data: IBookDTO = {
    authors: [],
    categories: [],
    id: null,
    isbn10: null,
    isbn13: null,
    publicationDate: null,
    publishers: [],
    title: null,
  }) {
    this.authors = data.authors;
    this.categories = data.categories;
    this.id = data.id;
    this.isbn10 = data.isbn10;
    this.isbn13 = data.isbn13;
    this.publicationDate = data.publicationDate;
    this.publishers = data.publishers;
    this.title = data.title;
  }
}
