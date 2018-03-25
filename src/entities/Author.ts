
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './Book';

@Entity({ name: 'author' })
export class Author {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public first_name!: string;

  @Column({
    nullable: true,
  })
  public middle_name!: string;

  @Column()
  public last_name!: string;

  @ManyToMany(() => Book, (book) => book.authors)
  public books!: Book[];
}
