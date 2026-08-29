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
import { Hospital } from './hospital.entity.js';

@Entity('villages')
@Unique('uq_village_location_name', ['name', 'district', 'state'])
@Index('idx_village_active', ['isActive'])
export class Village {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 150 }) name!: string;
  @Column({ type: 'varchar', length: 150 }) district!: string;
  @Column({ type: 'varchar', length: 100 }) state!: string;
  @Column({ type: 'boolean', default: true }) isActive!: boolean;
  @OneToMany(() => Hospital, (hospital) => hospital.village)
  hospitals!: Relation<Hospital[]>;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
