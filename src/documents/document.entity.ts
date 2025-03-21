import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  filename!: string;

  @Column()
  mimetype!: string;

  @Column()
  path!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
