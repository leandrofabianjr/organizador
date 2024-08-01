import { RepositoryBaseEntity } from 'src/commons/base-classes/repository-base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends RepositoryBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;
}
