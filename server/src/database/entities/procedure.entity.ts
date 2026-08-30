import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { HospitalProcedure } from './hospital-procedure.entity.js';

@Entity('procedures')
@Unique('uq_procedure_name', ['name'])
@Index('idx_procedure_active_category', ['isActive', 'category'])
export class Procedure {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 200 }) name!: string;
  @Column({ type: 'varchar', length: 100, nullable: true }) category!:
    string | null;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ type: 'boolean', default: true }) isActive!: boolean;
  @OneToMany(() => HospitalProcedure, (item) => item.procedure)
  hospitals!: Relation<HospitalProcedure[]>;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
