import { Material } from 'src/modules/materials/entities/material.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RECEIVED = 'received',
}

@Entity('material_requests')
export class MaterialRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  requestNumber: string;

  @ManyToOne(() => User)
  requestedBy: User;

  @ManyToOne(() => Material)
  material: Material;

  @Column('int')
  quantity: number;

  @Column({ type: 'timestamp' })
  requestDate: Date;

  @Column({ type: 'timestamp' })
  requiredDate: Date;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, { nullable: true })
  approvedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  approvalDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}