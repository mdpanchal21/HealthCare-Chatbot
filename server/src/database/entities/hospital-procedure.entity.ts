import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Hospital } from './hospital.entity.js';
import { Procedure } from './procedure.entity.js';

@Entity('hospital_procedures')
@Unique('uq_hospital_procedure', ['hospitalId', 'procedureId'])
@Index('idx_hospital_procedure_active', ['isActive'])
export class HospitalProcedure {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'uuid' }) hospitalId!: string;
  @ManyToOne(() => Hospital, (hospital) => hospital.procedures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hospitalId' })
  hospital!: Relation<Hospital>;
  @Column({ type: 'uuid' }) procedureId!: string;
  @ManyToOne(() => Procedure, (procedure) => procedure.hospitals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'procedureId' })
  procedure!: Relation<Procedure>;
  @Column({ type: 'numeric', nullable: true }) priceMin!: number | null;
  @Column({ type: 'numeric', nullable: true }) priceMax!: number | null;
  @Column({ type: 'numeric', nullable: true }) doctorChargeMin!: number | null;
  @Column({ type: 'numeric', nullable: true }) doctorChargeMax!: number | null;
  @Column({ type: 'numeric', nullable: true }) operationChargeMin!:
    number | null;
  @Column({ type: 'numeric', nullable: true }) operationChargeMax!:
    number | null;
  @Column({ type: 'numeric', nullable: true }) otChargeMin!: number | null;
  @Column({ type: 'numeric', nullable: true }) otChargeMax!: number | null;
  @Column({ type: 'numeric', nullable: true }) roomChargeMin!: number | null;
  @Column({ type: 'numeric', nullable: true }) roomChargeMax!: number | null;
  @Column({ type: 'numeric', nullable: true }) anesthesiaChargeMin!:
    number | null;
  @Column({ type: 'numeric', nullable: true }) anesthesiaChargeMax!:
    number | null;
  @Column({ type: 'numeric', nullable: true }) medicineChargeMin!:
    number | null;
  @Column({ type: 'numeric', nullable: true }) medicineChargeMax!:
    number | null;
  @Column({ type: 'numeric', nullable: true }) testChargeMin!: number | null;
  @Column({ type: 'numeric', nullable: true }) testChargeMax!: number | null;
  @Column({ type: 'numeric', nullable: true }) otherChargeMin!: number | null;
  @Column({ type: 'numeric', nullable: true }) otherChargeMax!: number | null;
  @Column({ type: 'text', nullable: true }) notes!: string | null;
  @Column({ type: 'boolean', default: true }) isActive!: boolean;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
