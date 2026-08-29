import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Hospital } from './hospital.entity.js';
import { Scheme } from './scheme.entity.js';

@Entity('hospital_schemes')
@Unique('uq_hospital_scheme', ['hospitalId', 'schemeId'])
export class HospitalScheme {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'uuid' }) hospitalId!: string;
  @ManyToOne(() => Hospital, (hospital) => hospital.schemes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hospitalId' })
  hospital!: Relation<Hospital>;
  @Column({ type: 'uuid' }) schemeId!: string;
  @ManyToOne(() => Scheme, (scheme) => scheme.hospitals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'schemeId' })
  scheme!: Relation<Scheme>;
  @Column({ type: 'boolean', default: false }) isAvailable!: boolean;
  @Column({ type: 'text', nullable: true }) notes!: string | null;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
