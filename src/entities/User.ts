
import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  public id!: number;

  @Column({
    name: 'avatar_url',
    nullable: true,
  })
  public avatarUrl!: string;

  @Column()
  public email!: string;

  @Column({
    nullable: true,
  })
  public name!: string;

  @Column({
    length: 39,
  })
  public username!: string;
}
