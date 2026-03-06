import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tumx03' })
export class Material {
  @PrimaryGeneratedColumn({ name: 'iMaterialID' })
    iMaterialID!: number;

  @Column({ unique: true })
    sMaterialCode!: string;

  @Column()
    sMaterialName!: string;

  @Column({ type: 'decimal', default: 0 })
    decUnitPrice!: number;

  @Column({ nullable: true })
    sDesc!: string;

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
