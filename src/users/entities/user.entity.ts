import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole, EntityStatus } from '../../common/constants/enums';
import { Password } from './password.entity';

@Entity({ name: 'tumx01' })
export class User {
  @PrimaryGeneratedColumn('increment')
  iUserID: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  sBadgeID: string;

  @Column({ type: 'varchar', length: 255 })
  sFullname: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  sEmail: string;

  @Column({ type: 'int', enum: UserRole })
  iRole: UserRole;

  @Column({ type: 'int', default: EntityStatus.ACTIVE })
  iStatus: EntityStatus;

  @Column({ type: 'int' })
  iCreateBy: number;

  @CreateDateColumn({ type: 'timestamp' })
  dtCreated: Date;

  @Column({ type: 'int', nullable: true })
  iUpdatedBy: number;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  dtUpdated: Date;

  @OneToMany(() => Password, (password) => password.user)
  passwords: Password[];
}