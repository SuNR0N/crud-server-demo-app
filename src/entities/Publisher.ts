
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './Book';

@Entity({ name: 'publisher' })
export class Publisher {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  public id!: number;

  @Column()
  public name!: string;

  @ManyToMany(() => Book, (book) => book.publishers)
  public books!: Book[];
}
