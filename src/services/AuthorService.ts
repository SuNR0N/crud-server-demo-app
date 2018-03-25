import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { TYPES } from '../constants/types';
import {
  AuthorUpdateDTO,
  NewAuthorDTO,
} from '../dtos';
import { Author } from '../entities/Author';

export interface IAuthorService {
  createAuthor(author: NewAuthorDTO): Promise<Author>;
  deleteAuthor(id: number): Promise<void>;
  getAuthor(id: number): Promise<Author | undefined>;
  getAuthors(): Promise<Author[]>;
  updateAuthor(id: number, author: AuthorUpdateDTO): Promise<Author>;
}

@injectable()
export class AuthorService implements IAuthorService {
  constructor(
    @inject(TYPES.AuthorRepository)
    private readonly authorRepository: Repository<Author>,
  ) { }

  public createAuthor(author: NewAuthorDTO): Promise<Author> {
    const newAuthor = this.authorRepository.create(author);
    return this.authorRepository.save(newAuthor);
  }

  public deleteAuthor(id: number): Promise<void> {
    return this.authorRepository.deleteById(id);
  }

  public getAuthor(id: number): Promise<Author | undefined> {
    return this.authorRepository.findOneById(id);
  }

  public getAuthors(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  public async updateAuthor(id: number, author: AuthorUpdateDTO): Promise<Author> {
    const existingAuthor = await this.authorRepository.findOneById(id);
    return this.authorRepository.save(existingAuthor!);
  }
}
