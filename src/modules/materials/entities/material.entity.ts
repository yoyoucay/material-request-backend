import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

export enum MaterialStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  unit: string; // pcs, kg, box, etc.

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'enum', enum: MaterialStatus, default: MaterialStatus.ACTIVE })
  status: MaterialStatus;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}