import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tumx01' })
export class User {
  @PrimaryGeneratedColumn({ name: 'iUserID' })
    iUserID!: number;

  @Column()
    sBadgeID!: string;

  @Column()
    sFullname!: string;

  @Column()
    sEmail!: string;

  @Column()
    iRole!: number;

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
