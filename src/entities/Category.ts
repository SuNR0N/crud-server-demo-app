
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './Book';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  public id!: number;

  @Column()
  public name!: string;

  @ManyToMany(() => Book, (book) => book.categories)
  public books!: Book[];
}
