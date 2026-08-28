import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';
import type { Relation } from 'typeorm';
import { HospitalScheme } from './hospital-scheme.entity.js';

@Entity('schemes')
@Unique('uq_scheme_name_state', ['name', 'state'])
@Index('idx_scheme_active_state', ['isActive', 'state'])
export class Scheme {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 200 }) name!: string;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ type: 'varchar', length: 100, nullable: true }) state!: string | null;
  @Column({ type: 'boolean', default: true }) isActive!: boolean;
  @OneToMany(() => HospitalScheme, (item) => item.scheme) hospitals!: Relation<HospitalScheme[]>;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}