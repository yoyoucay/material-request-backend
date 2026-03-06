import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Request } from '../../requests/entities/request.entity';

@Entity({ name: 'tudt02' })
export class MaterialDetail {
  @PrimaryGeneratedColumn({ name: 'iDetailID' })
  iDetailID: number;

  @Column()
  iRequestID: number;

  @Column()
  sMaterialCode: string;

  @Column('decimal')
  decQty: number;

  @Column()
  sDesc: string;

  @Column({ default: 1 })
  iStatus: number;

  @Column()
  iCreateBy: number;

  @Column()
  dtCreated: Date;

  @Column({ nullable: true })
  iUpdatedBy: number;

  @Column({ nullable: true })
  dtUpdated: Date;

  @ManyToOne(() => Request, (r) => r.details)
  @JoinColumn({ name: 'iRequestID' })
  request: Request;
}
