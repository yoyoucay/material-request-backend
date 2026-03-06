import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tumx02' })
export class UserPassword {
  @PrimaryGeneratedColumn({ name: 'iPassID' })
    iPassID!: number;

  @Column()
    iUserID!: number;

  @Column()
    sPassword!: string;

  @Column({ default: 1 })
    iStatus!: number;

  @Column()
    iCreateBy!: number;

  @Column()
    dtCreated!: Date;

  @Column({ nullable: true })
    iUpdatedBy!: number;

  @Column({ nullable: true })
    dtUpdated!: Date;
}
