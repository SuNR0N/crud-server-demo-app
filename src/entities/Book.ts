
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Author } from './Author';
import { Category } from './Category';
import { Publisher } from './Publisher';

@Entity({ name: 'book' })
export class Book {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    length: 10,
    name: 'isbn_10',
  })
  public isbn10!: string;

  @Column({
    length: 13,
    name: 'isbn_13',
  })
  public isbn13!: string;

  @Column()
  public title!: string;

  @Column({
    name: 'publication_date',
    type: 'date',
  })
  public publicationDate!: string;

  @ManyToMany(() => Author, (author) => author.books, {
    eager: true,
  })
  @JoinTable({
    inverseJoinColumn: {
      name: 'author_id',
      referencedColumnName: 'id',
    },
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    name: 'book_author',
  })
  public authors!: Author[];

  @ManyToMany(() => Category, (category) => category.books, {
    eager: true,
  })
  @JoinTable({
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    name: 'book_category',
  })
  public categories!: Category[];

  @ManyToMany(() => Publisher, (publisher) => publisher.books, {
    eager: true,
  })
  @JoinTable({
    inverseJoinColumn: {
      name: 'publisher_id',
      referencedColumnName: 'id',
    },
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    name: 'book_publisher',
  })
  public publishers!: Publisher[];
}
