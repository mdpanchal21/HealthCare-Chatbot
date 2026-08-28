import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';
import type { Relation } from 'typeorm';
import { Village } from './village.entity.js';
import { HospitalProcedure } from './hospital-procedure.entity.js';
import { HospitalScheme } from './hospital-scheme.entity.js';

export enum HospitalType { GOVERNMENT = 'government', PRIVATE = 'private', TRUST = 'trust', OTHER = 'other' }

@Entity('hospitals')
@Unique('uq_hospital_location_name', ['name', 'villageId'])
@Index('idx_hospital_active_type', ['isActive', 'hospitalType'])
export class Hospital {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 200 }) name!: string;
  @Column({ type: 'enum', enum: HospitalType }) hospitalType!: HospitalType;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ type: 'uuid' }) villageId!: string;
  @ManyToOne(() => Village, (village) => village.hospitals, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'villageId' }) village!: Relation<Village>;
  @Column({ type: 'varchar', length: 300 }) address!: string;
  @Column({ type: 'varchar', length: 150 }) district!: string;
  @Column({ type: 'varchar', length: 100 }) state!: string;
  @Column({ type: 'varchar', length: 30, nullable: true }) phone!: string | null;
  @Column({ type: 'varchar', length: 30, nullable: true }) emergencyPhone!: string | null;
  @Column({ type: 'varchar', length: 200, nullable: true }) email!: string | null;
  @Column({ type: 'varchar', length: 300, nullable: true }) website!: string | null;
  @Column({ type: 'boolean', default: false }) emergencyAvailable!: boolean;
  @Column({ type: 'boolean', default: false }) ambulanceAvailable!: boolean;
  @Column({ type: 'boolean', default: false }) icuAvailable!: boolean;
  @Column({ type: 'boolean', default: true }) isActive!: boolean;
  @OneToMany(() => HospitalProcedure, (item) => item.hospital) procedures!: Relation<HospitalProcedure[]>;
  @OneToMany(() => HospitalScheme, (item) => item.hospital) schemes!: Relation<HospitalScheme[]>;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}