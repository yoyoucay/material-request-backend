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
import { Request } from './request.entity';
import { Material } from '../../materials/entities/material.entity';

@Entity({ name: 'tudt02' })
export class RequestDetail {
  @PrimaryGeneratedColumn('increment')
  iDetailID: number;

  @Column({ type: 'int' })
  iRequestID: number;

  @Column({ type: 'varchar', length: 100 })
  sMaterialCode: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  decQty: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sDesc: string;

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

  @ManyToOne(() => Request, (request) => request.requestDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'iRequestID' })
  request: Request;

  @ManyToOne(() => Material, (material) => material.requestDetails)
  @JoinColumn({ name: 'sMaterialCode', referencedColumnName: 'sMaterialCode' })
  material: Material;
}