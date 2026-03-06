import { MaterialRequest } from 'src/modules/requests/entities/request.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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

  // @ManyToOne(() => MaterialRequest, (mr) => mr.details)
  @JoinColumn({ name: 'iRequestID' })
  request: MaterialRequest;
}
