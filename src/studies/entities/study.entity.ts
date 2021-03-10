import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Series } from './series.entity';

@Entity()
export class Study {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fkId!: number;

  @Column({ unique: true })
  uid!: string;

  @Column({ nullable: true })
  studyDate!: string;

  @Column({ nullable: true })
  studyTime!: string;

  @Column({ nullable: true })
  accessionNumber!: string;

  @Column({ nullable: true })
  referringPhysicianName!: string;

  @Column({ nullable: true })
  studyDescription!: string;

  @Column({ nullable: true })
  NameOfPhysicianReadingStudy!: string;

  @Column({ nullable: true })
  patientAge!: string;

  @Column({ nullable: true })
  patientSize!: string;

  @Column({ nullable: true })
  patientWeight!: string;

  @ManyToOne(() => Patient, (patient) => patient.studies)
  @JoinColumn({ name: 'fkId' })
  patient!: Patient;

  @OneToMany(() => Series, (series: Series) => series.study)
  series!: Series[];
}