import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EntityStatus } from '../../common/constants/enums';
import { RequestDetail } from 'src/requests/entities/request-detail.entity';


@Entity({ name: 'tumx03' })
export class Material {
  @PrimaryGeneratedColumn('increment')
  iMaterialID: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  sMaterialCode: string;

  @Column({ type: 'varchar', length: 255 })
  sMaterialName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  decUnitPrice: number;

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

  @OneToMany(() => RequestDetail, (detail) => detail.material)
  requestDetails: RequestDetail[];
}