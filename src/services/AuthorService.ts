import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { Types } from '../constants/types';
import {
  AuthorUpdateDTO,
  NewAuthorDTO,
} from '../dtos';
import { Author } from '../entities/Author';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';

export interface IAuthorService {
  createAuthor(author: NewAuthorDTO): Promise<Author>;
  deleteAuthor(id: number): Promise<void>;
  getAuthor(id: number): Promise<Author>;
  getAuthors(query: string): Promise<Author[]>;
  updateAuthor(id: number, author: AuthorUpdateDTO): Promise<Author>;
}

@injectable()
export class AuthorService implements IAuthorService {
  constructor(
    @inject(Types.AuthorRepository)
    private readonly authorRepository: Repository<Author>,
  ) { }

  public createAuthor(author: NewAuthorDTO): Promise<Author> {
    const newAuthor = this.authorRepository.create(author.toEntity());
    return this.authorRepository.save(newAuthor);
  }

  public async deleteAuthor(id: number): Promise<void> {
    const author = await this.authorRepository.findOne(id);
    if (!author) {
      throw new EntityNotFoundError(Author, id);
    }
    await this.authorRepository.delete(id);
  }

  public async getAuthor(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne(id);
    if (!author) {
      throw new EntityNotFoundError(Author, id);
    }
    return author;
  }

  public async getAuthors(query: string = ''): Promise<Author[]> {
    const paramLike = { query: `%${query.toLowerCase()}%` };
    return await this.authorRepository
      .createQueryBuilder('author')
      .where('LOWER(author.first_name) LIKE :query', paramLike)
      .orWhere('LOWER(author.middle_name) LIKE :query', paramLike)
      .orWhere('LOWER(author.last_name) LIKE :query', paramLike)
      .getMany();
  }

  public async updateAuthor(id: number, author: AuthorUpdateDTO): Promise<Author> {
    const existingAuthor = await this.authorRepository.findOne(id);
    if (!existingAuthor) {
      throw new EntityNotFoundError(Author, id);
    }
    const updatedAuthor: Author = {
      ...existingAuthor,
      ...author.toEntity(),
    };
    return this.authorRepository.save(updatedAuthor);
  }
}
