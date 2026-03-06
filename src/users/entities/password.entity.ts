import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EntityStatus } from '../../common/constants/enums';
import { User } from './user.entity';

@Entity({ name: 'tumx02' })
export class Password {
  @PrimaryGeneratedColumn('increment')
  iPassID: number;

  @Column({ type: 'int' })
  iUserID: number;

  @Column({ type: 'varchar', length: 255 })
  sPassword: string;

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

  @ManyToOne(() => User, (user) => user.passwords)
  @JoinColumn({ name: 'iUserID' })
  user: User;
}