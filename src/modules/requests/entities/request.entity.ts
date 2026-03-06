import { MaterialDetail } from 'src/modules/material-details/entities/material-detail.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'tudt01' })
export class Request {
  @PrimaryGeneratedColumn({ name: 'iRequestID' })
  iRequestID: number;

  @Column()
  sReqNumber: string;

  @Column()
  sDept: string;

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

  @OneToMany(() => MaterialDetail, (d) => d.request, { cascade: true })
  details: MaterialDetail[];
}
