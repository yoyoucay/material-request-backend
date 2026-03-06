import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EntityStatus } from '../../common/constants/enums';
import { RequestDetail } from './request-detail.entity';

@Entity({ name: 'tudt01' })
export class Request {
  @PrimaryGeneratedColumn('increment')
  iRequestID: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  sReqNumber: string;

  @Column({ type: 'varchar', length: 100 })
  sDept: string;

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

  @OneToMany(() => RequestDetail, (detail) => detail.request, { cascade: true })
  requestDetails: RequestDetail[];
}