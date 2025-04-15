import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true, nullable: false })
  name: string;

  @Column('text', { nullable: false })
  password: string;

  @Column('text', { nullable: true })
  email?: string;
}
